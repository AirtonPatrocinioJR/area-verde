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

class OperacaoController extends Controller
{
    public function receber(Request $request): Response
    {
        $clienteId = $request->query('cliente');
        $cliente = $clienteId
            ? Cliente::query()->find($clienteId)
            : null;

        return Inertia::render('Admin/Operacoes/Receber', [
            'clienteSelecionado' => $cliente ? $this->mapCliente($cliente) : null,
            'reciclaveis' => Reciclavel::ativos()
                ->orderBy('nome')
                ->get(['id', 'nome', 'valor', 'unidade']),
        ]);
    }

    public function confirmarRecebimento(Request $request, CarteiraService $carteira): RedirectResponse
    {
        $dados = $request->validate([
            'cliente_id' => ['required', 'exists:clientes,id'],
            'itens' => ['required', 'array', 'min:1'],
            'itens.*.reciclavel_id' => ['required', 'exists:reciclaveis,id'],
            'itens.*.quantidade' => ['required', 'numeric', 'min:0.01'],
        ], [
            'cliente_id.required' => 'Selecione o cliente.',
            'itens.required' => 'Adicione ao menos um material.',
            'itens.min' => 'Adicione ao menos um material.',
        ]);

        $cliente = Cliente::findOrFail($dados['cliente_id']);

        try {
            $carteira->receberReciclaveis(
                $cliente,
                $dados['itens'],
                $request->user('web'),
            );
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['itens' => $e->getMessage()]);
        }

        return redirect()
            ->route('admin.clientes.show', $cliente)
            ->with('success', 'Recebimento registrado. Florins creditados na carteira.');
    }

    public function vender(Request $request): Response
    {
        $clienteId = $request->query('cliente');
        $cliente = $clienteId
            ? Cliente::query()->find($clienteId)
            : null;

        return Inertia::render('Admin/Operacoes/Vender', [
            'clienteSelecionado' => $cliente ? $this->mapCliente($cliente) : null,
            'produtos' => Brinde::ativos()
                ->where('estoque', '>', 0)
                ->orderBy('nome')
                ->get()
                ->map(fn (Brinde $b) => [
                    'id' => $b->id,
                    'nome' => $b->nome,
                    'valor' => $b->valor,
                    'estoque' => $b->estoque,
                    'imagem_url' => $b->imagem_url,
                ]),
        ]);
    }

    public function confirmarVenda(Request $request, CarteiraService $carteira): RedirectResponse
    {
        $dados = $request->validate([
            'cliente_id' => ['required', 'exists:clientes,id'],
            'itens' => ['required', 'array', 'min:1'],
            'itens.*.brinde_id' => ['required', 'exists:brindes,id'],
            'itens.*.quantidade' => ['required', 'integer', 'min:1'],
        ], [
            'cliente_id.required' => 'Selecione o cliente.',
            'itens.required' => 'Adicione ao menos um produto.',
            'itens.min' => 'Adicione ao menos um produto.',
        ]);

        $cliente = Cliente::findOrFail($dados['cliente_id']);

        try {
            $carteira->venderProdutos(
                $cliente,
                $dados['itens'],
                $request->user('web'),
            );
        } catch (InvalidArgumentException $e) {
            return back()->withErrors(['itens' => $e->getMessage()]);
        }

        return redirect()
            ->route('admin.clientes.show', $cliente)
            ->with('success', 'Venda registrada. Florins debitados e estoque atualizado.');
    }

    public function buscarClientes(Request $request)
    {
        $busca = trim((string) $request->query('q', ''));

        if ($busca === '') {
            return response()->json(['data' => []]);
        }

        $telefone = Cliente::normalizarTelefone($busca);

        $clientes = Cliente::query()
            ->where(function ($q) use ($busca, $telefone) {
                $q->where('nome', 'like', "%{$busca}%");
                if ($telefone !== '') {
                    $q->orWhere('telefone', 'like', "%{$telefone}%");
                }
            })
            ->orderBy('nome')
            ->limit(10)
            ->get()
            ->map(fn (Cliente $c) => $this->mapCliente($c));

        return response()->json(['data' => $clientes]);
    }

    private function mapCliente(Cliente $cliente): array
    {
        return [
            'id' => $cliente->id,
            'nome' => $cliente->nome,
            'telefone' => $cliente->telefone,
            'saldo' => $cliente->saldo,
            'cidade' => $cliente->cidade,
        ];
    }
}
