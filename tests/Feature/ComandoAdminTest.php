<?php

namespace Tests\Feature;

use App\Models\Brinde;
use App\Models\Cliente;
use App\Models\MovimentoEstoque;
use App\Models\Reciclavel;
use App\Models\Transacao;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class ComandoAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_operador_nao_acessa_comandos(): void
    {
        $operador = User::factory()->operador()->create();

        $this->actingAs($operador, 'web')
            ->get('/admin/comandos')
            ->assertForbidden();

        $this->actingAs($operador, 'web')
            ->post('/admin/comandos', ['comando' => 'inspire'])
            ->assertForbidden();
    }

    public function test_admin_lista_comandos(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'web')
            ->get('/admin/comandos')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/Comandos/Index')
                ->has('prontos')
                ->has('bloqueados')
            );
    }

    public function test_admin_executa_comando_seguro(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'web')
            ->post('/admin/comandos', ['comando' => 'inspire'])
            ->assertRedirect(route('admin.comandos.index'))
            ->assertSessionHas('resultado.exit_code', 0)
            ->assertSessionHas('resultado.comando', 'inspire');
    }

    public function test_comando_bloqueado_e_rejeitado(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'web')
            ->from('/admin/comandos')
            ->post('/admin/comandos', ['comando' => 'db:wipe'])
            ->assertRedirect('/admin/comandos')
            ->assertSessionHasErrors('comando');
    }

    public function test_comando_inexistente_e_rejeitado(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'web')
            ->from('/admin/comandos')
            ->post('/admin/comandos', ['comando' => 'comando:fantasma'])
            ->assertRedirect('/admin/comandos')
            ->assertSessionHasErrors('comando');
    }

    public function test_limpar_dados_zera_tabelas_imagens_e_ids(): void
    {
        Storage::fake('public');

        $admin = User::factory()->admin()->create();

        $cliente = Cliente::create([
            'nome' => 'Cliente Teste',
            'telefone' => '11999998888',
            'cidade' => 'SP',
            'idade' => 30,
            'genero' => 'outro',
            'saldo' => 10,
        ]);

        $reciclavel = Reciclavel::create([
            'nome' => 'PET',
            'descricao' => null,
            'valor' => 1,
            'unidade' => 'un',
            'ativo' => true,
        ]);

        $imagem = 'produtos/teste.jpg';
        Storage::disk('public')->put($imagem, 'fake-image');

        $produto = Brinde::create([
            'nome' => 'Ecobag',
            'descricao' => null,
            'imagem' => $imagem,
            'valor' => 15,
            'estoque' => 5,
            'ativo' => true,
        ]);

        $transacao = Transacao::create([
            'cliente_id' => $cliente->id,
            'user_id' => $admin->id,
            'tipo' => Transacao::TIPO_CREDITO,
            'reciclavel_id' => $reciclavel->id,
            'brinde_id' => null,
            'quantidade' => 1,
            'valor_unitario' => 1,
            'valor_total' => 1,
            'saldo_apos' => 1,
            'descricao' => 'teste',
        ]);

        MovimentoEstoque::create([
            'brinde_id' => $produto->id,
            'user_id' => $admin->id,
            'transacao_id' => $transacao->id,
            'tipo' => MovimentoEstoque::TIPO_ENTRADA,
            'quantidade' => 5,
            'estoque_apos' => 5,
            'observacao' => 'inicial',
        ]);

        $this->artisan('app:limpar-dados', ['--force' => true])
            ->assertSuccessful();

        $this->assertDatabaseCount('clientes', 0);
        $this->assertDatabaseCount('transacoes', 0);
        $this->assertDatabaseCount('movimentos_estoque', 0);
        $this->assertDatabaseCount('brindes', 0);
        $this->assertDatabaseCount('reciclaveis', 0);
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
        Storage::disk('public')->assertMissing($imagem);

        $novo = Cliente::create([
            'nome' => 'Novo',
            'telefone' => '11911112222',
            'cidade' => 'SP',
            'idade' => 20,
            'genero' => 'outro',
            'saldo' => 0,
        ]);

        $this->assertSame(1, $novo->id);
    }
}
