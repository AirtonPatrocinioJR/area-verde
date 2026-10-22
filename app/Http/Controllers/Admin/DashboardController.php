<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Transacao;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $ultimas = Transacao::query()
            ->with(['cliente:id,nome,telefone'])
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'tipo' => $t->tipo,
                'descricao' => $t->descricao,
                'valor_total' => $t->valor_total,
                'cliente' => $t->cliente?->nome,
                'created_at' => $t->created_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'totais' => [
                'clientes' => Cliente::count(),
                'semente_circulacao' => Cliente::sum('saldo'),
                'transacoes' => Transacao::count(),
            ],
            'ultimas' => $ultimas,
        ]);
    }
}
