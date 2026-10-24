<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showCadastro(): Response
    {
        return Inertia::render('Cliente/Cadastro', [
            'generos' => Cliente::GENEROS,
        ]);
    }

    public function cadastro(Request $request): RedirectResponse
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
            'nome.required' => 'Informe o seu nome.',
            'telefone.required' => 'Informe o seu WhatsApp.',
            'cidade.required' => 'Informe a sua cidade.',
            'idade.required' => 'Informe a sua idade.',
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

        Auth::guard('cliente')->login($cliente);
        $request->session()->regenerate();

        return redirect()
            ->route('cliente.carteira')
            ->with('success', 'Carteira criada com sucesso! Bem-vindo(a) à Área Verde.');
    }

    public function showLogin(): Response
    {
        return Inertia::render('Cliente/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $dados = $request->validate([
            'telefone' => ['required', 'string'],
        ], [
            'telefone.required' => 'Informe o WhatsApp da sua carteira.',
        ]);

        $telefone = Cliente::normalizarTelefone($dados['telefone']);
        $cliente = Cliente::query()->where('telefone', $telefone)->first();

        if (! $cliente) {
            return back()
                ->withErrors(['telefone' => 'Nenhuma carteira encontrada com este WhatsApp.'])
                ->onlyInput('telefone');
        }

        Auth::guard('cliente')->login($cliente);
        $request->session()->regenerate();

        return redirect()->intended(route('cliente.carteira'));
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('cliente')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
