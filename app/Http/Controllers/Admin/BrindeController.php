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

    public function create(): Response
    {
        return Inertia::render('Admin/Brindes/Form', [
            'brinde' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Brinde::create($this->validated($request));

        return redirect()
            ->route('admin.brindes.index')
            ->with('success', 'Brinde cadastrado.');
    }

    public function edit(Brinde $brinde): Response
    {
        return Inertia::render('Admin/Brindes/Form', [
            'brinde' => [
                'id' => $brinde->id,
                'nome' => $brinde->nome,
                'descricao' => $brinde->descricao,
                'valor' => $brinde->valor,
                'estoque' => $brinde->estoque,
                'ativo' => $brinde->ativo,
            ],
        ]);
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
            'valor' => ['required', 'numeric', 'min:0.01'],
            'estoque' => ['required', 'integer', 'min:0'],
            'ativo' => ['sometimes', 'boolean'],
        ], [
            'nome.required' => 'Informe o nome.',
            'valor.required' => 'Informe o valor em Semente.',
            'valor.min' => 'O valor deve ser maior que zero.',
            'estoque.required' => 'Informe a quantidade em estoque.',
        ]) + ['ativo' => $request->boolean('ativo', true)];
    }
}
