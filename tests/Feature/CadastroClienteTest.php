<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CadastroClienteTest extends TestCase
{
    use RefreshDatabase;

    public function test_cadastro_com_campos_de_perfil(): void
    {
        $response = $this->post('/cadastro', [
            'nome' => 'Ana Silva',
            'telefone' => '(11) 98888-7777',
            'cidade' => 'Campinas',
            'idade' => 28,
            'genero' => 'feminino',
        ]);

        $response->assertRedirect(route('cliente.carteira'));
        $this->assertDatabaseHas('clientes', [
            'nome' => 'Ana Silva',
            'telefone' => '11988887777',
            'cidade' => 'Campinas',
            'idade' => 28,
            'genero' => 'feminino',
        ]);
        $this->assertAuthenticated('cliente');
    }

    public function test_cadastro_exige_cidade_idade_genero(): void
    {
        $response = $this->from('/cadastro')->post('/cadastro', [
            'nome' => 'Ana Silva',
            'telefone' => '11988887777',
        ]);

        $response->assertRedirect('/cadastro');
        $response->assertSessionHasErrors(['cidade', 'idade', 'genero']);
        $this->assertEquals(0, Cliente::count());
    }

    public function test_operador_cadastra_cliente_pelo_painel(): void
    {
        $operador = User::factory()->operador()->create();

        $response = $this->actingAs($operador, 'web')
            ->post(route('admin.clientes.store'), [
                'nome' => 'Bruno Costa',
                'telefone' => '(11) 97777-6666',
                'cidade' => 'Santos',
                'idade' => 35,
                'genero' => 'masculino',
            ]);

        $cliente = Cliente::query()->where('telefone', '11977776666')->first();

        $this->assertNotNull($cliente);
        $response->assertRedirect(route('admin.clientes.show', $cliente));
        $response->assertSessionHas('success');
        $this->assertAuthenticatedAs($operador, 'web');
        $this->assertGuest('cliente');
        $this->assertEquals('0.00', $cliente->saldo);
    }

    public function test_operador_nao_cadastra_whatsapp_duplicado(): void
    {
        $operador = User::factory()->operador()->create();

        Cliente::create([
            'nome' => 'Já Existe',
            'telefone' => '11977776666',
            'cidade' => 'Santos',
            'idade' => 30,
            'genero' => 'outro',
            'saldo' => 0,
        ]);

        $response = $this->actingAs($operador, 'web')
            ->from(route('admin.clientes.index'))
            ->post(route('admin.clientes.store'), [
                'nome' => 'Bruno Costa',
                'telefone' => '(11) 97777-6666',
                'cidade' => 'Santos',
                'idade' => 35,
                'genero' => 'masculino',
            ]);

        $response->assertRedirect(route('admin.clientes.index'));
        $response->assertSessionHasErrors('telefone');
        $this->assertEquals(1, Cliente::count());
    }

    public function test_visitante_nao_cadastra_cliente_pelo_painel(): void
    {
        $response = $this->post(route('admin.clientes.store'), [
            'nome' => 'Bruno Costa',
            'telefone' => '11977776666',
            'cidade' => 'Santos',
            'idade' => 35,
            'genero' => 'masculino',
        ]);

        $response->assertRedirect(route('admin.login'));
        $this->assertEquals(0, Cliente::count());
    }
}
