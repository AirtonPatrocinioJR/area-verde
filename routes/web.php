<?php

use App\Http\Controllers\Admin\AuthController as AdminAuthController;
use App\Http\Controllers\Admin\ClienteController;
use App\Http\Controllers\Admin\ComandoController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EstoqueController;
use App\Http\Controllers\Admin\OperacaoController;
use App\Http\Controllers\Admin\ProdutoController;
use App\Http\Controllers\Admin\ReciclavelController;
use App\Http\Controllers\Admin\RelatorioController;
use App\Http\Controllers\Admin\UsuarioController;
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
    Route::get('/carteira', [CarteiraController::class, 'show'])->name('cliente.carteira');
    Route::get('/meu-cadastro', [CarteiraController::class, 'cadastro'])->name('cliente.meu-cadastro');
    Route::put('/meu-cadastro', [CarteiraController::class, 'atualizarCadastro']);
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

        Route::resource('reciclaveis', ReciclavelController::class)
            ->except(['show', 'create', 'edit'])
            ->parameters(['reciclaveis' => 'reciclavel']);

        Route::redirect('brindes', '/admin/produtos');
        Route::resource('produtos', ProdutoController::class)
            ->parameters(['produtos' => 'produto']);

        Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
        Route::get('/clientes/{cliente}', [ClienteController::class, 'show'])->name('clientes.show');

        Route::get('/receber', [OperacaoController::class, 'receber'])->name('receber');
        Route::post('/receber', [OperacaoController::class, 'confirmarRecebimento'])->name('receber.store');
        Route::get('/vender', [OperacaoController::class, 'vender'])->name('vender');
        Route::post('/vender', [OperacaoController::class, 'confirmarVenda'])->name('vender.store');
        Route::get('/clientes-busca', [OperacaoController::class, 'buscarClientes'])->name('clientes.busca');

        Route::get('/estoque', [EstoqueController::class, 'index'])->name('estoque.index');
        Route::post('/estoque/{produto}/entrada', [EstoqueController::class, 'entrada'])->name('estoque.entrada');
        Route::post('/estoque/{produto}/ajustar', [EstoqueController::class, 'ajustar'])->name('estoque.ajustar');
        Route::get('/estoque/{produto}/historico', [EstoqueController::class, 'historico'])->name('estoque.historico');

        Route::get('/relatorios', [RelatorioController::class, 'index'])->name('relatorios.index');
        Route::get('/relatorios/exportar/recebimentos', [RelatorioController::class, 'exportarRecebimentos'])
            ->name('relatorios.exportar.recebimentos');
        Route::get('/relatorios/exportar/vendas', [RelatorioController::class, 'exportarVendas'])
            ->name('relatorios.exportar.vendas');

        Route::middleware('admin')->group(function () {
            Route::resource('usuarios', UsuarioController::class)->except(['show', 'create', 'edit']);

            Route::get('/comandos', [ComandoController::class, 'index'])->name('comandos.index');
            Route::post('/comandos', [ComandoController::class, 'executar'])->name('comandos.executar');
        });
    });
});
