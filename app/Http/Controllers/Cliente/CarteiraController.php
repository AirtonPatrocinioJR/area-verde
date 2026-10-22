<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CarteiraController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $cliente = $request->user('cliente');

        $transacoes = $cliente->transacoes()
            ->with(['reciclavel:id,nome,unidade', 'brinde:id,nome'])
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($t) => [
                'id' => $t->id,
                'tipo' => $t->tipo,
                'descricao' => $t->descricao,
                'quantidade' => $t->quantidade,
                'valor_total' => $t->valor_total,
                'saldo_apos' => $t->saldo_apos,
                'created_at' => $t->created_at?->timezone(config('app.timezone'))->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Cliente/Carteira', [
            'cliente' => [
                'id' => $cliente->id,
                'nome' => $cliente->nome,
                'telefone' => $cliente->telefone,
                'saldo' => $cliente->saldo,
            ],
            'transacoes' => $transacoes,
        ]);
    }
}
