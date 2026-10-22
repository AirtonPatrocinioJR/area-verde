<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brinde;
use App\Models\Cliente;
use App\Models\Reciclavel;
use App\Services\CarteiraService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class ClienteController extends Controller
{
    public function index(Request $request): Response
    {
        $busca = trim((string) $request->query('q', ''));

        $clientes = Cliente::query()
            ->when($busca !== '', function ($query) use ($busca) {
                $telefone = Cliente::normalizarTelefone($busca);
                $query->where(function ($q) use ($busca, $telefone) {
                    $q->where('nome', 'like', "%{$busca}%");
                    if ($telefone !== '') {
                        $q->orWhere('telefone', 'like', "%{$telefone}%");
                    }
                });
            })
            ->orderBy('nome')
            ->paginate(20)
            ->withQueryString()
            ->through(fn ($c) => [
                'id' => $c->id,
                'nome' => $c->nome,
                'telefone' => $c->telefone,
                'saldo' => $c->saldo,
            ]);

        return Inertia::render('Admin/Clientes/Index', [
            'clientes' => $clientes,
            'filtros' => ['q' => $busca],
        ]);
    }

    public function show(Cliente $cliente): Response
    {
        $transacoes = $cliente->transacoes()
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($t) => [
                'id' => $t->id,
                'tipo' => $t->tipo,
                'descricao' => $t->descricao,
                'quantidade' => $t->quantidade,
                'valor_total' => $t->valor_total,
                'saldo_apos' => $t->saldo_apos,
                'created_at' => $t->created_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Admin/Clientes/Show', [
            'cliente' => [
                'id' => $cliente->id,
                'nome' => $cliente->nome,
                'telefone' => $cliente->telefone,
                'saldo' => $cliente->saldo,
            ],
            'reciclaveis' => Reciclavel::ativos()->orderBy('nome')->get(['id', 'nome', 'valor', 'unidade']),
            'brindes' => Brinde::ativos()->where('estoque', '>', 0)->orderBy('nome')->get(['id', 'nome', 'valor', 'estoque']),
            'transacoes' => $transacoes,
        ]);
    }

    public function creditar(Request $request, Cliente $cliente, CarteiraService $carteira): RedirectResponse
    {
        $dados = $request->validate([
            'reciclavel_id' => ['required', 'exists:reciclaveis,id'],
            'quantidade' => ['required', 'numeric', 'min:0.01'],
        ], [
            'reciclavel_id.required' => 'Selecione o reciclável.',
            'quantidade.required' => 'Informe a quantidade.',
            'quantidade.min' => 'A quantidade deve ser maior que zero.',
        ]);

        $reciclavel = Reciclavel::findOrFail($dados['reciclavel_id']);

        try {
            $carteira->creditar(
                $cliente,
                $reciclavel,
                $dados['quantidade'],
                $request->user('web'),
            );
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['quantidade' => $e->getMessage()]);
        }

        return back()->with('success', 'Crédito em Semente registrado.');
    }

    public function debitar(Request $request, Cliente $cliente, CarteiraService $carteira): RedirectResponse
    {
        $dados = $request->validate([
            'brinde_id' => ['required', 'exists:brindes,id'],
            'quantidade' => ['required', 'integer', 'min:1'],
        ], [
            'brinde_id.required' => 'Selecione o brinde.',
            'quantidade.required' => 'Informe a quantidade.',
            'quantidade.min' => 'A quantidade deve ser pelo menos 1.',
        ]);

        $brinde = Brinde::findOrFail($dados['brinde_id']);

        try {
            $carteira->debitar(
                $cliente,
                $brinde,
                (int) $dados['quantidade'],
                $request->user('web'),
            );
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['quantidade' => $e->getMessage()]);
        }

        return back()->with('success', 'Débito em Semente registrado.');
    }
}
