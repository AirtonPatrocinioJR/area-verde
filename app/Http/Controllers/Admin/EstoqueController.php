<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brinde;
use App\Models\MovimentoEstoque;
use App\Services\CarteiraService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;

class EstoqueController extends Controller
{
    public function index(Request $request): Response
    {
        $busca = trim((string) $request->query('q', ''));

        $produtos = Brinde::query()
            ->when($busca !== '', fn ($q) => $q->where('nome', 'like', "%{$busca}%"))
            ->orderBy('nome')
            ->get();

        return Inertia::render('Admin/Estoque/Index', [
            'produtos' => $produtos->map(fn (Brinde $b) => [
                'id' => $b->id,
                'nome' => $b->nome,
                'estoque' => $b->estoque,
                'ativo' => $b->ativo,
                'imagem_url' => $b->imagem_url,
                'estoque_baixo' => $b->estoque_baixo,
            ]),
            'totais' => [
                'cadastrados' => $produtos->count(),
                'unidades' => $produtos->sum('estoque'),
                'estoque_baixo' => $produtos->where('estoque_baixo', true)->count(),
            ],
            'filtros' => ['q' => $busca],
        ]);
    }

    public function entrada(Request $request, Brinde $produto, CarteiraService $carteira): RedirectResponse
    {
        $dados = $request->validate([
            'quantidade' => ['required', 'integer', 'min:1'],
            'observacao' => ['nullable', 'string', 'max:255'],
        ], [
            'quantidade.required' => 'Informe a quantidade.',
            'quantidade.min' => 'A quantidade deve ser pelo menos 1.',
        ]);

        try {
            $carteira->registrarEntradaEstoque(
                $produto,
                (int) $dados['quantidade'],
                $request->user('web'),
                $dados['observacao'] ?? null,
            );
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['quantidade' => $e->getMessage()]);
        }

        return back()->with('success', 'Entrada de estoque registrada.');
    }

    public function ajustar(Request $request, Brinde $produto, CarteiraService $carteira): RedirectResponse
    {
        $dados = $request->validate([
            'estoque' => ['required', 'integer', 'min:0'],
            'observacao' => ['nullable', 'string', 'max:255'],
        ], [
            'estoque.required' => 'Informe o novo estoque.',
            'estoque.min' => 'O estoque não pode ser negativo.',
        ]);

        try {
            $carteira->ajustarEstoque(
                $produto,
                (int) $dados['estoque'],
                $request->user('web'),
                $dados['observacao'] ?? null,
            );
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['estoque' => $e->getMessage()]);
        }

        return back()->with('success', 'Estoque ajustado.');
    }

    public function historico(Brinde $produto): Response
    {
        $movimentos = MovimentoEstoque::query()
            ->where('brinde_id', $produto->id)
            ->with('operador:id,name')
            ->latest()
            ->paginate(30)
            ->through(fn (MovimentoEstoque $m) => [
                'id' => $m->id,
                'tipo' => $m->tipo,
                'quantidade' => $m->quantidade,
                'estoque_apos' => $m->estoque_apos,
                'observacao' => $m->observacao,
                'operador' => $m->operador?->name,
                'created_at' => $m->created_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Admin/Estoque/Historico', [
            'produto' => [
                'id' => $produto->id,
                'nome' => $produto->nome,
                'estoque' => $produto->estoque,
                'imagem_url' => $produto->imagem_url,
            ],
            'movimentos' => $movimentos,
        ]);
    }
}
