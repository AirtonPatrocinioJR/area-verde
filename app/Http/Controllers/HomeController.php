<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response|RedirectResponse
    {
        if (Auth::guard('cliente')->check()) {
            return redirect()->route('cliente.carteira');
        }

        if (Auth::guard('web')->check()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('Home');
    }
}
