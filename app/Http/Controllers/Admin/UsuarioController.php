<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    public function index(): Response
    {
        $usuarios = User::query()
            ->orderBy('name')
            ->get()
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'papel' => $u->papel,
            ]);

        return Inertia::render('Admin/Usuarios/Index', [
            'usuarios' => $usuarios,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $dados = $this->validated($request);

        User::create($dados);

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', 'Usuário criado.');
    }

    public function update(Request $request, User $usuario): RedirectResponse
    {
        $dados = $this->validated($request, $usuario);

        if (
            $usuario->isAdmin()
            && ($dados['papel'] ?? $usuario->papel) !== User::PAPEL_ADMIN
            && $this->isUltimoAdmin($usuario)
        ) {
            return back()->withErrors([
                'papel' => 'Não é possível rebaixar o último administrador.',
            ]);
        }

        if (empty($dados['password'])) {
            unset($dados['password']);
        }

        $usuario->update($dados);

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', 'Usuário atualizado.');
    }

    public function destroy(Request $request, User $usuario): RedirectResponse
    {
        if ($request->user('web')?->is($usuario)) {
            return back()->with('error', 'Você não pode excluir a si mesmo.');
        }

        if ($usuario->isAdmin() && $this->isUltimoAdmin($usuario)) {
            return back()->with('error', 'Não é possível excluir o último administrador.');
        }

        $usuario->delete();

        return redirect()
            ->route('admin.usuarios.index')
            ->with('success', 'Usuário excluído.');
    }

    private function validated(Request $request, ?User $usuario = null): array
    {
        $editing = $usuario !== null;

        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($usuario?->id),
            ],
            'password' => [
                $editing ? 'nullable' : 'required',
                'string',
                Password::defaults(),
            ],
            'papel' => ['required', Rule::in([User::PAPEL_ADMIN, User::PAPEL_OPERADOR])],
        ], [
            'name.required' => 'Informe o nome.',
            'email.required' => 'Informe o e-mail.',
            'email.email' => 'Informe um e-mail válido.',
            'email.unique' => 'Este e-mail já está em uso.',
            'password.required' => 'Informe a senha.',
            'papel.required' => 'Selecione o papel.',
            'papel.in' => 'Papel inválido.',
        ]);
    }

    private function isUltimoAdmin(User $usuario): bool
    {
        return User::query()
            ->where('papel', User::PAPEL_ADMIN)
            ->whereKeyNot($usuario->id)
            ->doesntExist();
    }
}
