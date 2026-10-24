<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class UsuarioAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_operador_nao_acessa_gestao_de_usuarios(): void
    {
        $operador = User::factory()->operador()->create();

        $this->actingAs($operador, 'web')
            ->get('/admin/usuarios')
            ->assertForbidden();
    }

    public function test_admin_lista_usuarios(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->operador()->create(['name' => 'Operador Teste']);

        $this->actingAs($admin, 'web')
            ->get('/admin/usuarios')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Admin/Usuarios/Index')
                ->has('usuarios', 2)
            );
    }

    public function test_admin_cria_operador(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'web')
            ->post('/admin/usuarios', [
                'name' => 'Novo Operador',
                'email' => 'novo@areaverde.local',
                'password' => 'senha12345',
                'papel' => User::PAPEL_OPERADOR,
            ])
            ->assertRedirect(route('admin.usuarios.index'));

        $this->assertDatabaseHas('users', [
            'email' => 'novo@areaverde.local',
            'papel' => User::PAPEL_OPERADOR,
        ]);
    }

    public function test_admin_nao_pode_excluir_a_si_mesmo(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'web')
            ->from('/admin/usuarios')
            ->delete("/admin/usuarios/{$admin->id}")
            ->assertRedirect('/admin/usuarios')
            ->assertSessionHas('error');

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_nao_e_possivel_excluir_o_ultimo_admin(): void
    {
        $admin = User::factory()->admin()->create();
        $outroAdmin = User::factory()->admin()->create();

        $outroAdmin->delete();

        $this->actingAs($admin, 'web')
            ->from('/admin/usuarios')
            ->delete("/admin/usuarios/{$admin->id}")
            ->assertRedirect('/admin/usuarios')
            ->assertSessionHas('error');

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_nao_e_possivel_rebaixar_o_ultimo_admin(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'web')
            ->from('/admin/usuarios')
            ->put("/admin/usuarios/{$admin->id}", [
                'name' => $admin->name,
                'email' => $admin->email,
                'papel' => User::PAPEL_OPERADOR,
            ])
            ->assertRedirect('/admin/usuarios')
            ->assertSessionHasErrors('papel');

        $admin->refresh();
        $this->assertTrue($admin->isAdmin());
    }
}
