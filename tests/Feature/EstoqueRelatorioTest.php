<?php

namespace Tests\Feature;

use App\Models\Brinde;
use App\Models\Cliente;
use App\Models\Reciclavel;
use App\Models\User;
use App\Services\CarteiraService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EstoqueRelatorioTest extends TestCase
{
    use RefreshDatabase;

    private User $operador;

    protected function setUp(): void
    {
        parent::setUp();

        $this->operador = User::factory()->create([
            'email' => 'operador@test.local',
        ]);
    }

    public function test_entrada_e_ajuste_de_estoque(): void
    {
        $produto = Brinde::create([
            'nome' => 'Ecobag',
            'descricao' => null,
            'valor' => 15,
            'estoque' => 10,
            'ativo' => true,
        ]);

        $this->actingAs($this->operador, 'web')
            ->post(route('admin.estoque.entrada', $produto), [
                'quantidade' => 5,
                'observacao' => 'Reposição',
            ])
            ->assertRedirect();

        $produto->refresh();
        $this->assertEquals(15, $produto->estoque);

        $this->actingAs($this->operador, 'web')
            ->post(route('admin.estoque.ajustar', $produto), [
                'estoque' => 12,
                'observacao' => 'Inventário',
            ])
            ->assertRedirect();

        $produto->refresh();
        $this->assertEquals(12, $produto->estoque);
        $this->assertDatabaseCount('movimentos_estoque', 2);
    }

    public function test_exportacao_csv_recebimentos(): void
    {
        $cliente = Cliente::create([
            'nome' => 'Cliente',
            'telefone' => '11911112222',
            'cidade' => 'SP',
            'idade' => 20,
            'genero' => 'outro',
            'saldo' => 0,
        ]);

        $reciclavel = Reciclavel::create([
            'nome' => 'PET',
            'descricao' => null,
            'valor' => 1,
            'unidade' => 'un',
            'ativo' => true,
        ]);

        app(CarteiraService::class)->receberReciclaveis($cliente, [
            ['reciclavel_id' => $reciclavel->id, 'quantidade' => 3],
        ], $this->operador);

        $response = $this->actingAs($this->operador, 'web')
            ->get(route('admin.relatorios.exportar.recebimentos', [
                'de' => now()->toDateString(),
                'ate' => now()->toDateString(),
            ]));

        $response->assertOk();
        $response->assertHeader('content-disposition');
        $this->assertStringContainsString('PET', $response->streamedContent());
        $this->assertStringContainsString('3,00', $response->streamedContent());
    }

    public function test_produto_estoque_baixo(): void
    {
        $baixo = Brinde::create([
            'nome' => 'Chapéu',
            'descricao' => null,
            'valor' => 30,
            'estoque' => 3,
            'ativo' => true,
        ]);

        $this->assertTrue($baixo->estoque_baixo);

        $ok = Brinde::create([
            'nome' => 'Caneca',
            'descricao' => null,
            'valor' => 25,
            'estoque' => 20,
            'ativo' => true,
        ]);

        $this->assertFalse($ok->estoque_baixo);
    }
}
