<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'auth' => [
                'cliente' => fn () => $request->user('cliente')
                    ? [
                        'id' => $request->user('cliente')->id,
                        'nome' => $request->user('cliente')->nome,
                        'telefone' => $request->user('cliente')->telefone,
                        'saldo' => $request->user('cliente')->saldo,
                    ]
                    : null,
                'operador' => fn () => $request->user('web')
                    ? [
                        'id' => $request->user('web')->id,
                        'name' => $request->user('web')->name,
                        'email' => $request->user('web')->email,
                        'papel' => $request->user('web')->papel,
                    ]
                    : null,
            ],
        ];
    }
}
