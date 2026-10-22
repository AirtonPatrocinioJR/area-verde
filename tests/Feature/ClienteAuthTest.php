<?php

namespace Tests\Feature;

use App\Models\Cliente;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClienteAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_cliente_pode_se_cadastrar(): void
    {
        $response = $this->post('/cadastro', [
            'nome' => 'João Silva',
            'telefone' => '(11) 91234-5678',
        ]);

        $response->assertRedirect(route('cliente.carteira'));
        $this->assertDatabaseHas('clientes', [
            'nome' => 'João Silva',
            'telefone' => '11912345678',
            'saldo' => 0,
        ]);
        $this->assertAuthenticated('cliente');
    }

    public function test_cliente_pode_fazer_login_por_telefone(): void
    {
        Cliente::create([
            'nome' => 'Ana',
            'telefone' => '11999998888',
            'saldo' => 5,
        ]);

        $response = $this->post('/entrar', [
            'telefone' => '(11) 99999-8888',
        ]);

        $response->assertRedirect(route('cliente.carteira'));
        $this->assertAuthenticated('cliente');
    }

    public function test_telefone_duplicado_nao_cadastra(): void
    {
        Cliente::create([
            'nome' => 'Existente',
            'telefone' => '11911112222',
            'saldo' => 0,
        ]);

        $response = $this->from('/cadastro')->post('/cadastro', [
            'nome' => 'Outro',
            'telefone' => '11911112222',
        ]);

        $response->assertRedirect('/cadastro');
        $response->assertSessionHasErrors('telefone');
    }
}
