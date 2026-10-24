<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Transacao;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
                'cidade' => $c->cidade,
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
            ->with(['reciclavel:id,nome,unidade', 'brinde:id,nome'])
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

        return Inertia::render('Admin/Clientes/Show', [
            'cliente' => [
                'id' => $cliente->id,
                'nome' => $cliente->nome,
                'telefone' => $cliente->telefone,
                'cidade' => $cliente->cidade,
                'idade' => $cliente->idade,
                'genero_label' => $cliente->generoLabel(),
                'saldo' => $cliente->saldo,
            ],
            'transacoes' => $transacoes,
        ]);
    }
}
