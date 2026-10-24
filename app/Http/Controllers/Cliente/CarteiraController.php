<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Transacao;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CarteiraController extends Controller
{
    public function show(Request $request): Response
    {
        $cliente = $request->user('cliente');
        $filtro = $request->query('filtro', 'tudo');

        $transacoes = $cliente->transacoes()
            ->with(['reciclavel:id,nome,unidade', 'brinde:id,nome'])
            ->when($filtro === 'entradas', fn ($q) => $q->where('tipo', Transacao::TIPO_CREDITO))
            ->when($filtro === 'compras', fn ($q) => $q->where('tipo', Transacao::TIPO_DEBITO))
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($t) => [
                'id' => $t->id,
                'tipo' => $t->tipo,
                'descricao' => $t->descricao,
                'item' => $t->tipo === Transacao::TIPO_CREDITO
                    ? ($t->reciclavel?->nome ?? 'Material')
                    : ($t->brinde?->nome ?? 'Produto'),
                'rotulo' => $t->tipo === Transacao::TIPO_CREDITO ? 'Entrega' : 'Compra',
                'quantidade' => $t->quantidade,
                'valor_total' => $t->valor_total,
                'saldo_apos' => $t->saldo_apos,
                'created_at' => $t->created_at?->timezone(config('app.timezone'))->format('d/m/Y · H:i'),
            ]);

        $recebidos = (float) $cliente->transacoes()
            ->where('tipo', Transacao::TIPO_CREDITO)
            ->sum('valor_total');
        $utilizados = (float) $cliente->transacoes()
            ->where('tipo', Transacao::TIPO_DEBITO)
            ->sum('valor_total');

        return Inertia::render('Cliente/Carteira', [
            'cliente' => $this->mapCliente($cliente),
            'totais' => [
                'recebidos' => $recebidos,
                'utilizados' => $utilizados,
            ],
            'filtro' => $filtro,
            'transacoes' => $transacoes,
        ]);
    }

    public function cadastro(Request $request): Response
    {
        $cliente = $request->user('cliente');

        return Inertia::render('Cliente/MeuCadastro', [
            'cliente' => $this->mapCliente($cliente),
            'generos' => Cliente::GENEROS,
        ]);
    }

    public function atualizarCadastro(Request $request): RedirectResponse
    {
        $cliente = $request->user('cliente');

        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:120'],
            'cidade' => ['required', 'string', 'max:120'],
            'idade' => ['required', 'integer', 'min:1', 'max:120'],
            'genero' => ['required', Rule::in(array_keys(Cliente::GENEROS))],
        ], [
            'nome.required' => 'Informe o seu nome.',
            'cidade.required' => 'Informe a sua cidade.',
            'idade.required' => 'Informe a sua idade.',
            'genero.required' => 'Selecione o gênero.',
        ]);

        $cliente->update($dados);

        return back()->with('success', 'Cadastro atualizado.');
    }

    private function mapCliente(Cliente $cliente): array
    {
        return [
            'id' => $cliente->id,
            'nome' => $cliente->nome,
            'telefone' => $cliente->telefone,
            'cidade' => $cliente->cidade,
            'idade' => $cliente->idade,
            'genero' => $cliente->genero,
            'genero_label' => $cliente->generoLabel(),
            'saldo' => $cliente->saldo,
        ];
    }
}
