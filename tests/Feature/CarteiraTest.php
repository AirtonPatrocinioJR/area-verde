<?php

namespace Tests\Feature;

use App\Models\Brinde;
use App\Models\Cliente;
use App\Models\Reciclavel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarteiraTest extends TestCase
{
    use RefreshDatabase;

    private User $operador;

    private Cliente $cliente;

    protected function setUp(): void
    {
        parent::setUp();

        $this->operador = User::factory()->create([
            'email' => 'operador@test.local',
        ]);

        $this->cliente = Cliente::create([
            'nome' => 'Cliente Teste',
            'telefone' => '11900001111',
            'cidade' => 'São Paulo',
            'idade' => 30,
            'genero' => 'outro',
            'saldo' => 0,
        ]);
    }

    public function test_credito_atualiza_saldo_corretamente(): void
    {
        $reciclavel = Reciclavel::create([
            'nome' => 'PET',
            'descricao' => null,
            'valor' => 1,
            'unidade' => 'un',
            'ativo' => true,
        ]);

        $response = $this->actingAs($this->operador, 'web')
            ->post(route('admin.receber.store'), [
                'cliente_id' => $this->cliente->id,
                'itens' => [
                    [
                        'reciclavel_id' => $reciclavel->id,
                        'quantidade' => 10,
                    ],
                ],
            ]);

        $response->assertRedirect();
        $this->cliente->refresh();
        $this->assertEquals('10.00', $this->cliente->saldo);
        $this->assertDatabaseHas('transacoes', [
            'cliente_id' => $this->cliente->id,
            'tipo' => 'credito',
            'valor_total' => 10.00,
        ]);
    }

    public function test_recebimento_multiplos_itens(): void
    {
        $pet = Reciclavel::create([
            'nome' => 'PET',
            'descricao' => null,
            'valor' => 1,
            'unidade' => 'un',
            'ativo' => true,
        ]);
        $papel = Reciclavel::create([
            'nome' => 'Papelão',
            'descricao' => null,
            'valor' => 2,
            'unidade' => 'kg',
            'ativo' => true,
        ]);

        $this->actingAs($this->operador, 'web')
            ->post(route('admin.receber.store'), [
                'cliente_id' => $this->cliente->id,
                'itens' => [
                    ['reciclavel_id' => $pet->id, 'quantidade' => 5],
                    ['reciclavel_id' => $papel->id, 'quantidade' => 2],
                ],
            ])
            ->assertRedirect();

        $this->cliente->refresh();
        $this->assertEquals('9.00', $this->cliente->saldo);
        $this->assertEquals(2, $this->cliente->transacoes()->count());
    }

    public function test_debito_bloqueado_por_saldo_insuficiente(): void
    {
        $brinde = Brinde::create([
            'nome' => 'Caneca',
            'descricao' => null,
            'valor' => 20,
            'estoque' => 5,
            'ativo' => true,
        ]);

        $response = $this->actingAs($this->operador, 'web')
            ->from(route('admin.vender'))
            ->post(route('admin.vender.store'), [
                'cliente_id' => $this->cliente->id,
                'itens' => [
                    [
                        'brinde_id' => $brinde->id,
                        'quantidade' => 1,
                    ],
                ],
            ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors('itens');
        $this->cliente->refresh();
        $this->assertEquals('0.00', $this->cliente->saldo);
        $brinde->refresh();
        $this->assertEquals(5, $brinde->estoque);
    }

    public function test_debito_bloqueado_por_estoque_insuficiente(): void
    {
        $this->cliente->update(['saldo' => 100]);

        $brinde = Brinde::create([
            'nome' => 'Kit',
            'descricao' => null,
            'valor' => 8,
            'estoque' => 0,
            'ativo' => true,
        ]);

        $response = $this->actingAs($this->operador, 'web')
            ->from(route('admin.vender'))
            ->post(route('admin.vender.store'), [
                'cliente_id' => $this->cliente->id,
                'itens' => [
                    [
                        'brinde_id' => $brinde->id,
                        'quantidade' => 1,
                    ],
                ],
            ]);

        $response->assertRedirect();
        $response->assertSessionHasErrors('itens');
    }

    public function test_debito_baixa_estoque_e_saldo(): void
    {
        $this->cliente->update(['saldo' => 50]);

        $brinde = Brinde::create([
            'nome' => 'Ecobag',
            'descricao' => null,
            'valor' => 15,
            'estoque' => 10,
            'ativo' => true,
        ]);

        $this->actingAs($this->operador, 'web')
            ->post(route('admin.vender.store'), [
                'cliente_id' => $this->cliente->id,
                'itens' => [
                    [
                        'brinde_id' => $brinde->id,
                        'quantidade' => 2,
                    ],
                ],
            ])
            ->assertRedirect();

        $this->cliente->refresh();
        $brinde->refresh();
        $this->assertEquals('20.00', $this->cliente->saldo);
        $this->assertEquals(8, $brinde->estoque);
        $this->assertDatabaseHas('movimentos_estoque', [
            'brinde_id' => $brinde->id,
            'tipo' => 'venda',
            'quantidade' => -2,
            'estoque_apos' => 8,
        ]);
    }
}
