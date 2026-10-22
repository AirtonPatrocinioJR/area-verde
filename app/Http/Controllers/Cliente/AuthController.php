<?php

namespace App\Http\Controllers\Cliente;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showCadastro(): Response
    {
        return Inertia::render('Cliente/Cadastro');
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
                        $fail('Informe um telefone válido com DDD.');
                    }
                    if (Cliente::query()->where('telefone', $normalizado)->exists()) {
                        $fail('Este telefone já possui uma carteira.');
                    }
                },
            ],
        ], [
            'nome.required' => 'Informe o seu nome.',
            'telefone.required' => 'Informe o seu telefone.',
        ]);

        $cliente = Cliente::create([
            'nome' => $dados['nome'],
            'telefone' => $dados['telefone'],
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
            'telefone.required' => 'Informe o telefone da sua carteira.',
        ]);

        $telefone = Cliente::normalizarTelefone($dados['telefone']);
        $cliente = Cliente::query()->where('telefone', $telefone)->first();

        if (! $cliente) {
            return back()
                ->withErrors(['telefone' => 'Nenhuma carteira encontrada com este telefone.'])
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
