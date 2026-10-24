<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brinde;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrindeController extends Controller
{
    public function index(): Response
    {
        $brindes = Brinde::query()
            ->orderBy('nome')
            ->get()
            ->map(fn ($b) => [
                'id' => $b->id,
                'nome' => $b->nome,
                'descricao' => $b->descricao,
                'valor' => $b->valor,
                'estoque' => $b->estoque,
                'ativo' => $b->ativo,
            ]);

        return Inertia::render('Admin/Brindes/Index', [
            'brindes' => $brindes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Brinde::create($this->validated($request));

        return redirect()
            ->route('admin.brindes.index')
            ->with('success', 'Brinde cadastrado.');
    }

    public function update(Request $request, Brinde $brinde): RedirectResponse
    {
        $brinde->update($this->validated($request));

        return redirect()
            ->route('admin.brindes.index')
            ->with('success', 'Brinde atualizado.');
    }

    public function destroy(Brinde $brinde): RedirectResponse
    {
        if ($brinde->transacoes()->exists()) {
            $brinde->update(['ativo' => false]);

            return redirect()
                ->route('admin.brindes.index')
                ->with('success', 'Brinde desativado (já possui movimentações).');
        }

        $brinde->delete();

        return redirect()
            ->route('admin.brindes.index')
            ->with('success', 'Brinde excluído.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'nome' => ['required', 'string', 'max:120'],
            'descricao' => ['nullable', 'string', 'max:1000'],
            'valor' => ['required', 'integer', 'min:1'],
            'estoque' => ['required', 'integer', 'min:0'],
            'ativo' => ['sometimes', 'boolean'],
        ], [
            'nome.required' => 'Informe o nome.',
            'valor.required' => 'Informe o valor em Sementes.',
            'valor.integer' => 'O valor deve ser um número inteiro.',
            'valor.min' => 'O valor deve ser pelo menos 1 Semente.',
            'estoque.required' => 'Informe a quantidade em estoque.',
        ]) + ['ativo' => $request->boolean('ativo', true)];
    }
}
