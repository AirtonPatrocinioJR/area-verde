<?php

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\BrindeController;
use App\Http\Controllers\Admin\ClienteController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ReciclavelController;
use App\Http\Controllers\Cliente\AuthController as ClienteAuthController;
use App\Http\Controllers\Cliente\CarteiraController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware('guest:cliente')->group(function () {
    Route::get('/cadastro', [ClienteAuthController::class, 'showCadastro'])->name('cliente.cadastro');
    Route::post('/cadastro', [ClienteAuthController::class, 'cadastro']);
    Route::get('/entrar', [ClienteAuthController::class, 'showLogin'])->name('cliente.login');
    Route::post('/entrar', [ClienteAuthController::class, 'login']);
});

Route::middleware('auth:cliente')->group(function () {
    Route::get('/carteira', CarteiraController::class)->name('cliente.carteira');
    Route::post('/sair', [ClienteAuthController::class, 'logout'])->name('cliente.logout');
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:web')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'showLogin'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'login']);
    });

    Route::middleware('auth:web')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');
        Route::get('/', DashboardController::class)->name('dashboard');

        Route::resource('reciclaveis', ReciclavelController::class)->except(['show']);
        Route::resource('brindes', BrindeController::class)->except(['show']);

        Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
        Route::get('/clientes/{cliente}', [ClienteController::class, 'show'])->name('clientes.show');
        Route::post('/clientes/{cliente}/creditar', [ClienteController::class, 'creditar'])->name('clientes.creditar');
        Route::post('/clientes/{cliente}/debitar', [ClienteController::class, 'debitar'])->name('clientes.debitar');
    });
});
