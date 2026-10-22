<?php

namespace App\Services;

use App\Models\Brinde;
use App\Models\Cliente;
use App\Models\Reciclavel;
use App\Models\Transacao;
use App\Models\User;
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
        $quantidade = round((float) $quantidade, 2);

        if ($quantidade <= 0) {
            throw new InvalidArgumentException('A quantidade deve ser maior que zero.');
        }

        if (! $reciclavel->ativo) {
            throw new InvalidArgumentException('Este reciclável está inativo.');
        }

        return DB::transaction(function () use ($cliente, $reciclavel, $quantidade, $operador) {
            $cliente = Cliente::query()->whereKey($cliente->id)->lockForUpdate()->firstOrFail();
            $reciclavel = Reciclavel::query()->whereKey($reciclavel->id)->lockForUpdate()->firstOrFail();

            $valorUnitario = (float) $reciclavel->valor;
            $valorTotal = round($valorUnitario * $quantidade, 2);
            $novoSaldo = round((float) $cliente->saldo + $valorTotal, 2);

            $cliente->saldo = $novoSaldo;
            $cliente->save();

            return Transacao::create([
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
                    'Doação de %s %s de %s',
                    number_format($quantidade, 2, ',', '.'),
                    $reciclavel->unidade,
                    $reciclavel->nome,
                ),
            ]);
        });
    }

    public function debitar(
        Cliente $cliente,
        Brinde $brinde,
        int $quantidade,
        ?User $operador = null,
    ): Transacao {
        if ($quantidade <= 0) {
            throw new InvalidArgumentException('A quantidade deve ser maior que zero.');
        }

        if (! $brinde->ativo) {
            throw new InvalidArgumentException('Este brinde está inativo.');
        }

        return DB::transaction(function () use ($cliente, $brinde, $quantidade, $operador) {
            $cliente = Cliente::query()->whereKey($cliente->id)->lockForUpdate()->firstOrFail();
            $brinde = Brinde::query()->whereKey($brinde->id)->lockForUpdate()->firstOrFail();

            if ($brinde->estoque < $quantidade) {
                throw new InvalidArgumentException('Estoque insuficiente para este brinde.');
            }

            $valorUnitario = (float) $brinde->valor;
            $valorTotal = round($valorUnitario * $quantidade, 2);
            $saldoAtual = (float) $cliente->saldo;

            if ($saldoAtual < $valorTotal) {
                throw new InvalidArgumentException('Saldo insuficiente em Semente.');
            }

            $novoSaldo = round($saldoAtual - $valorTotal, 2);

            $cliente->saldo = $novoSaldo;
            $cliente->save();

            $brinde->estoque = $brinde->estoque - $quantidade;
            $brinde->save();

            return Transacao::create([
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
                    'Resgate de %dx %s',
                    $quantidade,
                    $brinde->nome,
                ),
            ]);
        });
    }
}
