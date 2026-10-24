<?php

namespace App\Services;

use App\Events\CarteiraAtualizada;
use App\Models\Brinde;
use App\Models\Cliente;
use App\Models\MovimentoEstoque;
use App\Models\Reciclavel;
use App\Models\Transacao;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CarteiraService
{
    public function creditar(
        Cliente $cliente,
        Reciclavel $reciclavel,
        float|string $quantidade,
        ?User $operador = null,
    ): Transacao {
        $transacoes = $this->receberReciclaveis($cliente, [
            [
                'reciclavel_id' => $reciclavel->id,
                'quantidade' => $quantidade,
            ],
        ], $operador);

        return $transacoes->first();
    }

    /**
     * @param  list<array{reciclavel_id: int, quantidade: float|string}>  $itens
     * @return Collection<int, Transacao>
     */
    public function receberReciclaveis(Cliente $cliente, array $itens, ?User $operador = null): Collection
    {
        if ($itens === []) {
            throw new InvalidArgumentException('Adicione ao menos um material.');
        }

        $transacoes = DB::transaction(function () use ($cliente, $itens, $operador) {
            $cliente = Cliente::query()->whereKey($cliente->id)->lockForUpdate()->firstOrFail();
            $criadas = collect();

            foreach ($itens as $item) {
                $quantidade = round((float) $item['quantidade'], 2);

                if ($quantidade <= 0) {
                    throw new InvalidArgumentException('A quantidade deve ser maior que zero.');
                }

                $reciclavel = Reciclavel::query()
                    ->whereKey($item['reciclavel_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if (! $reciclavel->ativo) {
                    throw new InvalidArgumentException("O material {$reciclavel->nome} está inativo.");
                }

                $valorUnitario = (float) $reciclavel->valor;
                $valorTotal = round($valorUnitario * $quantidade, 2);
                $novoSaldo = round((float) $cliente->saldo + $valorTotal, 2);

                $cliente->saldo = $novoSaldo;
                $cliente->save();

                $criadas->push(Transacao::create([
                    'cliente_id' => $cliente->id,
                    'user_id' => $operador?->id,
                    'tipo' => Transacao::TIPO_CREDITO,
                    'reciclavel_id' => $reciclavel->id,
                    'brinde_id' => null,
                    'quantidade' => $quantidade,
                    'valor_unitario' => $valorUnitario,
                    'valor_total' => $valorTotal,
                    'saldo_apos' => $novoSaldo,
                    'descricao' => sprintf(
                        'Entrega de %s %s de %s',
                        number_format($quantidade, 2, ',', '.'),
                        $reciclavel->unidade,
                        $reciclavel->nome,
                    ),
                ]));
            }

            return $criadas;
        });

        $transacoes->each(fn (Transacao $t) => $this->notificarCarteira($t));

        return $transacoes;
    }

    public function debitar(
        Cliente $cliente,
        Brinde $brinde,
        int $quantidade,
        ?User $operador = null,
    ): Transacao {
        $transacoes = $this->venderProdutos($cliente, [
            [
                'brinde_id' => $brinde->id,
                'quantidade' => $quantidade,
            ],
        ], $operador);

        return $transacoes->first();
    }

    /**
     * @param  list<array{brinde_id: int, quantidade: int}>  $itens
     * @return Collection<int, Transacao>
     */
    public function venderProdutos(Cliente $cliente, array $itens, ?User $operador = null): Collection
    {
        if ($itens === []) {
            throw new InvalidArgumentException('Adicione ao menos um produto.');
        }

        $transacoes = DB::transaction(function () use ($cliente, $itens, $operador) {
            $cliente = Cliente::query()->whereKey($cliente->id)->lockForUpdate()->firstOrFail();
            $criadas = collect();

            $totalVenda = 0.0;
            $linhas = [];

            foreach ($itens as $item) {
                $quantidade = (int) $item['quantidade'];

                if ($quantidade <= 0) {
                    throw new InvalidArgumentException('A quantidade deve ser maior que zero.');
                }

                $brinde = Brinde::query()
                    ->whereKey($item['brinde_id'])
                    ->lockForUpdate()
                    ->firstOrFail();

                if (! $brinde->ativo) {
                    throw new InvalidArgumentException("O produto {$brinde->nome} está inativo.");
                }

                if ($brinde->estoque < $quantidade) {
                    throw new InvalidArgumentException("Estoque insuficiente para {$brinde->nome}.");
                }

                $valorUnitario = (float) $brinde->valor;
                $valorTotal = round($valorUnitario * $quantidade, 2);
                $totalVenda = round($totalVenda + $valorTotal, 2);

                $linhas[] = compact('brinde', 'quantidade', 'valorUnitario', 'valorTotal');
            }

            $saldoAtual = (float) $cliente->saldo;

            if ($saldoAtual < $totalVenda) {
                throw new InvalidArgumentException('Saldo insuficiente em Florins.');
            }

            foreach ($linhas as $linha) {
                /** @var Brinde $brinde */
                $brinde = $linha['brinde'];
                $quantidade = $linha['quantidade'];
                $valorUnitario = $linha['valorUnitario'];
                $valorTotal = $linha['valorTotal'];

                $novoSaldo = round((float) $cliente->saldo - $valorTotal, 2);
                $cliente->saldo = $novoSaldo;
                $cliente->save();

                $brinde->estoque = $brinde->estoque - $quantidade;
                $brinde->save();

                $transacao = Transacao::create([
                    'cliente_id' => $cliente->id,
                    'user_id' => $operador?->id,
                    'tipo' => Transacao::TIPO_DEBITO,
                    'reciclavel_id' => null,
                    'brinde_id' => $brinde->id,
                    'quantidade' => $quantidade,
                    'valor_unitario' => $valorUnitario,
                    'valor_total' => $valorTotal,
                    'saldo_apos' => $novoSaldo,
                    'descricao' => sprintf(
                        'Compra de %dx %s',
                        $quantidade,
                        $brinde->nome,
                    ),
                ]);

                MovimentoEstoque::create([
                    'brinde_id' => $brinde->id,
                    'user_id' => $operador?->id,
                    'transacao_id' => $transacao->id,
                    'tipo' => MovimentoEstoque::TIPO_VENDA,
                    'quantidade' => -$quantidade,
                    'estoque_apos' => $brinde->estoque,
                    'observacao' => 'Venda de produto',
                ]);

                $criadas->push($transacao);
            }

            return $criadas;
        });

        $transacoes->each(fn (Transacao $t) => $this->notificarCarteira($t));

        return $transacoes;
    }

    public function registrarEntradaEstoque(
        Brinde $brinde,
        int $quantidade,
        ?User $operador = null,
        ?string $observacao = null,
    ): MovimentoEstoque {
        if ($quantidade <= 0) {
            throw new InvalidArgumentException('A quantidade deve ser maior que zero.');
        }

        return DB::transaction(function () use ($brinde, $quantidade, $operador, $observacao) {
            $brinde = Brinde::query()->whereKey($brinde->id)->lockForUpdate()->firstOrFail();
            $brinde->estoque = $brinde->estoque + $quantidade;
            $brinde->save();

            return MovimentoEstoque::create([
                'brinde_id' => $brinde->id,
                'user_id' => $operador?->id,
                'transacao_id' => null,
                'tipo' => MovimentoEstoque::TIPO_ENTRADA,
                'quantidade' => $quantidade,
                'estoque_apos' => $brinde->estoque,
                'observacao' => $observacao ?? 'Entrada de estoque',
            ]);
        });
    }

    public function ajustarEstoque(
        Brinde $brinde,
        int $novoEstoque,
        ?User $operador = null,
        ?string $observacao = null,
    ): MovimentoEstoque {
        if ($novoEstoque < 0) {
            throw new InvalidArgumentException('O estoque não pode ser negativo.');
        }

        return DB::transaction(function () use ($brinde, $novoEstoque, $operador, $observacao) {
            $brinde = Brinde::query()->whereKey($brinde->id)->lockForUpdate()->firstOrFail();
            $delta = $novoEstoque - $brinde->estoque;
            $brinde->estoque = $novoEstoque;
            $brinde->save();

            return MovimentoEstoque::create([
                'brinde_id' => $brinde->id,
                'user_id' => $operador?->id,
                'transacao_id' => null,
                'tipo' => MovimentoEstoque::TIPO_AJUSTE,
                'quantidade' => $delta,
                'estoque_apos' => $brinde->estoque,
                'observacao' => $observacao ?? 'Ajuste de estoque',
            ]);
        });
    }

    private function notificarCarteira(Transacao $transacao): void
    {
        CarteiraAtualizada::dispatch($transacao);
    }
}
