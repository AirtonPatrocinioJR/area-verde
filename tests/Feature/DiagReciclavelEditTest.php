<?php

namespace Tests\Feature;

use App\Models\Reciclavel;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class DiagReciclavelEditTest extends TestCase
{
    use RefreshDatabase;

    public function test_index_lista_dados_do_reciclavel(): void
    {
        $user = User::factory()->create();
        Reciclavel::create([
            'nome' => 'Teste Nome',
            'descricao' => 'Desc teste',
            'valor' => 2,
            'unidade' => 'kg',
            'ativo' => true,
        ]);

        $this->actingAs($user, 'web')
            ->get('/admin/reciclaveis')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/Reciclaveis/Index')
                ->has('reciclaveis', 1)
                ->where('reciclaveis.0.nome', 'Teste Nome')
                ->where('reciclaveis.0.unidade', 'kg')
                ->where('reciclaveis.0.valor', 2)
            );
    }

    public function test_atualiza_reciclavel_via_put(): void
    {
        $user = User::factory()->create();
        $r = Reciclavel::create([
            'nome' => 'Teste Nome',
            'descricao' => 'Desc teste',
            'valor' => 2,
            'unidade' => 'kg',
            'ativo' => true,
        ]);

        $this->actingAs($user, 'web')
            ->put("/admin/reciclaveis/{$r->id}", [
                'nome' => 'Nome Atualizado',
                'descricao' => 'Nova descrição',
                'valor' => 3,
                'unidade' => 'un',
                'ativo' => true,
            ])
            ->assertRedirect(route('admin.reciclaveis.index'));

        $this->assertDatabaseHas('reciclaveis', [
            'id' => $r->id,
            'nome' => 'Nome Atualizado',
            'unidade' => 'un',
            'valor' => 3,
        ]);
    }

    public function test_nao_aceita_valor_decimal(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'web')
            ->from('/admin/reciclaveis')
            ->post('/admin/reciclaveis', [
                'nome' => 'Inválido',
                'descricao' => null,
                'valor' => 1.5,
                'unidade' => 'kg',
                'ativo' => true,
            ])
            ->assertRedirect('/admin/reciclaveis')
            ->assertSessionHasErrors('valor');
    }
}
