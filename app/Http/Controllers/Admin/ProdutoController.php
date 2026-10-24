<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brinde;
use App\Models\MovimentoEstoque;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProdutoController extends Controller
{
    public function index(): Response
    {
        $produtos = Brinde::query()
            ->orderBy('nome')
            ->get()
            ->map(fn (Brinde $b) => $this->mapProduto($b));

        return Inertia::render('Admin/Produtos/Index', [
            'produtos' => $produtos,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Produtos/Form', [
            'produto' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $this->validated($request);
        $estoqueInicial = (int) $dados['estoque'];

        $produto = Brinde::create($dados);

        if ($estoqueInicial > 0) {
            MovimentoEstoque::create([
                'brinde_id' => $produto->id,
                'user_id' => $request->user('web')?->id,
                'transacao_id' => null,
                'tipo' => MovimentoEstoque::TIPO_ENTRADA,
                'quantidade' => $estoqueInicial,
                'estoque_apos' => $estoqueInicial,
                'observacao' => 'Estoque inicial',
            ]);
        }

        return redirect()
            ->route('admin.produtos.index')
            ->with('success', 'Produto cadastrado.');
    }

    public function edit(Brinde $produto): Response
    {
        return Inertia::render('Admin/Produtos/Form', [
            'produto' => $this->mapProduto($produto),
        ]);
    }

    public function update(Request $request, Brinde $produto): RedirectResponse
    {
        $dados = $this->validated($request, $produto);

        // Estoque é gerido na tela de estoque; não sobrescrever no edit sem intenção.
        unset($dados['estoque']);

        $produto->update($dados);

        return redirect()
            ->route('admin.produtos.index')
            ->with('success', 'Produto atualizado.');
    }

    public function destroy(Brinde $produto): RedirectResponse
    {
        if ($produto->transacoes()->exists()) {
            $produto->update(['ativo' => false]);

            return redirect()
                ->route('admin.produtos.index')
                ->with('success', 'Produto desativado (já possui movimentações).');
        }

        if ($produto->imagem) {
            Storage::disk('public')->delete($produto->imagem);
        }

        $produto->delete();

        return redirect()
            ->route('admin.produtos.index')
            ->with('success', 'Produto excluído.');
    }

    private function validated(Request $request, ?Brinde $produto = null): array
    {
        $rules = [
            'nome' => ['required', 'string', 'max:120'],
            'descricao' => ['nullable', 'string', 'max:200'],
            'valor' => ['required', 'integer', 'min:1'],
            'ativo' => ['sometimes', 'boolean'],
            'imagem' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:5120'],
            'remover_imagem' => ['sometimes', 'boolean'],
        ];

        if (! $produto) {
            $rules['estoque'] = ['required', 'integer', 'min:0'];
        }

        $dados = $request->validate($rules, [
            'nome.required' => 'Informe o nome.',
            'valor.required' => 'Informe o valor em Florins.',
            'valor.integer' => 'O valor deve ser um número inteiro.',
            'valor.min' => 'O valor deve ser pelo menos 1 Florim.',
            'estoque.required' => 'Informe o estoque inicial.',
            'descricao.max' => 'A descrição pode ter no máximo 200 caracteres.',
            'imagem.image' => 'Envie uma imagem JPG ou PNG.',
            'imagem.max' => 'A imagem deve ter no máximo 5 MB.',
        ]);

        $dados['ativo'] = $request->boolean('ativo', true);

        if ($request->boolean('remover_imagem') && $produto?->imagem) {
            Storage::disk('public')->delete($produto->imagem);
            $dados['imagem'] = null;
        }

        if ($request->hasFile('imagem')) {
            if ($produto?->imagem) {
                Storage::disk('public')->delete($produto->imagem);
            }
            $dados['imagem'] = $request->file('imagem')->store('produtos', 'public');
        } else {
            unset($dados['imagem']);
        }

        unset($dados['remover_imagem']);

        return $dados;
    }

    private function mapProduto(Brinde $b): array
    {
        return [
            'id' => $b->id,
            'nome' => $b->nome,
            'descricao' => $b->descricao,
            'valor' => $b->valor,
            'estoque' => $b->estoque,
            'ativo' => $b->ativo,
            'imagem_url' => $b->imagem_url,
            'estoque_baixo' => $b->estoque_baixo,
        ];
    }
}
