<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Transacao;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
            'generos' => Cliente::GENEROS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'nome' => ['required', 'string', 'max:120'],
            'telefone' => [
                'required',
                'string',
                'min:10',
                'max:20',
                function (string $attribute, mixed $value, \Closure $fail) {
                    $normalizado = Cliente::normalizarTelefone((string) $value);
                    if (strlen($normalizado) < 10) {
                        $fail('Informe um WhatsApp válido com DDD.');
                    }
                    if (Cliente::query()->where('telefone', $normalizado)->exists()) {
                        $fail('Este WhatsApp já possui uma carteira.');
                    }
                },
            ],
            'cidade' => ['required', 'string', 'max:120'],
            'idade' => ['required', 'integer', 'min:1', 'max:120'],
            'genero' => ['required', Rule::in(array_keys(Cliente::GENEROS))],
        ], [
            'nome.required' => 'Informe o nome do cliente.',
            'telefone.required' => 'Informe o WhatsApp do cliente.',
            'cidade.required' => 'Informe a cidade.',
            'idade.required' => 'Informe a idade.',
            'genero.required' => 'Selecione o gênero.',
        ]);

        $cliente = Cliente::create([
            'nome' => $dados['nome'],
            'telefone' => $dados['telefone'],
            'cidade' => $dados['cidade'],
            'idade' => $dados['idade'],
            'genero' => $dados['genero'],
            'saldo' => 0,
        ]);

        return redirect()
            ->route('admin.clientes.show', $cliente)
            ->with('success', 'Cliente cadastrado com sucesso.');
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
