<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reciclavel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReciclavelController extends Controller
{
    public function index(): Response
    {
        $reciclaveis = Reciclavel::query()
            ->orderBy('nome')
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'nome' => $r->nome,
                'descricao' => $r->descricao,
                'valor' => $r->valor,
                'unidade' => $r->unidade,
                'ativo' => $r->ativo,
            ]);

        return Inertia::render('Admin/Reciclaveis/Index', [
            'reciclaveis' => $reciclaveis,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Reciclaveis/Form', [
            'reciclavel' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $this->validated($request);
        Reciclavel::create($dados);

        return redirect()
            ->route('admin.reciclaveis.index')
            ->with('success', 'Reciclável cadastrado.');
    }

    public function edit(Reciclavel $reciclavel): Response
    {
        return Inertia::render('Admin/Reciclaveis/Form', [
            'reciclavel' => [
                'id' => $reciclavel->id,
                'nome' => $reciclavel->nome,
                'descricao' => $reciclavel->descricao,
                'valor' => $reciclavel->valor,
                'unidade' => $reciclavel->unidade,
                'ativo' => $reciclavel->ativo,
            ],
        ]);
    }

    public function update(Request $request, Reciclavel $reciclavel): RedirectResponse
    {
        $reciclavel->update($this->validated($request));

        return redirect()
            ->route('admin.reciclaveis.index')
            ->with('success', 'Reciclável atualizado.');
    }

    public function destroy(Reciclavel $reciclavel): RedirectResponse
    {
        if ($reciclavel->transacoes()->exists()) {
            $reciclavel->update(['ativo' => false]);

            return redirect()
                ->route('admin.reciclaveis.index')
                ->with('success', 'Reciclável desativado (já possui movimentações).');
        }

        $reciclavel->delete();

        return redirect()
            ->route('admin.reciclaveis.index')
            ->with('success', 'Reciclável excluído.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'nome' => ['required', 'string', 'max:120'],
            'descricao' => ['nullable', 'string', 'max:1000'],
            'valor' => ['required', 'numeric', 'min:0.01'],
            'unidade' => ['required', 'string', 'max:20'],
            'ativo' => ['sometimes', 'boolean'],
        ], [
            'nome.required' => 'Informe o nome.',
            'valor.required' => 'Informe o valor em Semente.',
            'valor.min' => 'O valor deve ser maior que zero.',
            'unidade.required' => 'Informe a unidade de medida.',
        ]) + ['ativo' => $request->boolean('ativo', true)];
    }
}
