<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AcessoTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitante_nao_acessa_carteira(): void
    {
        $this->get('/carteira')->assertRedirect(route('cliente.login'));
    }

    public function test_visitante_nao_acessa_admin(): void
    {
        $this->get('/admin')->assertRedirect(route('admin.login'));
    }

    public function test_cliente_nao_acessa_admin(): void
    {
        $cliente = Cliente::create([
            'nome' => 'Cliente',
            'telefone' => '11955554444',
            'saldo' => 0,
        ]);

        $this->actingAs($cliente, 'cliente')
            ->get('/admin')
            ->assertRedirect(route('admin.login'));
    }

    public function test_operador_nao_acessa_carteira_como_cliente(): void
    {
        $operador = User::factory()->create();

        $this->actingAs($operador, 'web')
            ->get('/carteira')
            ->assertRedirect(route('cliente.login'));
    }

    public function test_operador_acessa_painel(): void
    {
        $operador = User::factory()->create();

        $this->actingAs($operador, 'web')
            ->get('/admin')
            ->assertOk();
    }
}
