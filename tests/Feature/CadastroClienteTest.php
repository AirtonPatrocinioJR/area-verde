<?php

namespace Tests\Feature;

use App\Models\Cliente;
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
}
