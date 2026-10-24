<?php

namespace Database\Seeders;

use App\Models\Brinde;
use App\Models\Cliente;
use App\Models\Reciclavel;
use App\Models\User;
use App\Services\CarteiraService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@areaverde.local'],
            [
                'name' => 'Admin Área Verde',
                'password' => Hash::make('senha123'),
                'papel' => User::PAPEL_ADMIN,
            ],
        );

        $operador = User::query()->updateOrCreate(
            ['email' => 'operador@areaverde.local'],
            [
                'name' => 'Operador Área Verde',
                'password' => Hash::make('senha123'),
                'papel' => User::PAPEL_OPERADOR,
            ],
        );

        $reciclaveis = [
            ['nome' => 'Garrafa PET', 'descricao' => 'Garrafa plástica PET limpa', 'valor' => 1, 'unidade' => 'un'],
            ['nome' => 'Latinha de alumínio', 'descricao' => 'Lata de alumínio amassada', 'valor' => 1, 'unidade' => 'un'],
            ['nome' => 'Papelão', 'descricao' => 'Papelão limpo e seco', 'valor' => 2, 'unidade' => 'kg'],
            ['nome' => 'Vidro', 'descricao' => 'Garrafas e potes de vidro', 'valor' => 1, 'unidade' => 'kg'],
            ['nome' => 'Óleo de cozinha', 'descricao' => 'Óleo usado acondicionado', 'valor' => 2, 'unidade' => 'L'],
        ];

        foreach ($reciclaveis as $item) {
            Reciclavel::query()->updateOrCreate(
                ['nome' => $item['nome']],
                [...$item, 'ativo' => true],
            );
        }

        $brindes = [
            ['nome' => 'Ecobag', 'descricao' => 'Sacola reutilizável de tecido', 'valor' => 15, 'estoque' => 50],
            ['nome' => 'Caneca', 'descricao' => 'Caneca ecológica 300ml', 'valor' => 25, 'estoque' => 30],
            ['nome' => 'Muda de planta', 'descricao' => 'Muda nativa em tubete', 'valor' => 10, 'estoque' => 40],
            ['nome' => 'Kit sementes', 'descricao' => 'Kit com 5 envelopes de sementes', 'valor' => 8, 'estoque' => 60],
        ];

        foreach ($brindes as $item) {
            Brinde::query()->updateOrCreate(
                ['nome' => $item['nome']],
                [...$item, 'ativo' => true],
            );
        }

        $cliente = Cliente::query()->updateOrCreate(
            ['telefone' => '11987654321'],
            [
                'nome' => 'Maria Exemplo',
                'saldo' => 0,
            ],
        );

        if ($cliente->transacoes()->count() === 0) {
            $carteira = app(CarteiraService::class);
            $pet = Reciclavel::query()->where('nome', 'Garrafa PET')->first();
            $papelao = Reciclavel::query()->where('nome', 'Papelão')->first();
            $ecobag = Brinde::query()->where('nome', 'Ecobag')->first();

            $carteira->creditar($cliente, $pet, 20, $operador);
            $cliente->refresh();
            $carteira->creditar($cliente, $papelao, 3.5, $operador);
            $cliente->refresh();
            $carteira->debitar($cliente, $ecobag, 1, $operador);
        }
    }
}
