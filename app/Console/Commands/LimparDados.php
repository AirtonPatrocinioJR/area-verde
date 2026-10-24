<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class LimparDados extends Command
{
    protected $signature = 'app:limpar-dados {--force : Executa sem pedir confirmação}';

    protected $description = 'Remove clientes, transações, estoque, produtos e recicláveis, reiniciando os IDs';

    public function handle(): int
    {
        if (! $this->option('force') && ! $this->confirm('Isso apaga clientes, transações, produtos e recicláveis. Continuar?')) {
            $this->warn('Operação cancelada.');

            return self::FAILURE;
        }

        $contagens = [
            'movimentos_estoque' => DB::table('movimentos_estoque')->count(),
            'transacoes' => DB::table('transacoes')->count(),
            'clientes' => DB::table('clientes')->count(),
            'brindes' => DB::table('brindes')->count(),
            'reciclaveis' => DB::table('reciclaveis')->count(),
        ];

        DB::transaction(function () {
            Schema::disableForeignKeyConstraints();

            DB::table('movimentos_estoque')->truncate();
            DB::table('transacoes')->truncate();
            DB::table('clientes')->truncate();
            DB::table('brindes')->truncate();
            DB::table('reciclaveis')->truncate();

            Schema::enableForeignKeyConstraints();
        });

        Storage::disk('public')->deleteDirectory('produtos');

        $this->info("Movimentos de estoque removidos: {$contagens['movimentos_estoque']}");
        $this->info("Transações removidas: {$contagens['transacoes']}");
        $this->info("Clientes removidos: {$contagens['clientes']}");
        $this->info("Produtos removidos: {$contagens['brindes']}");
        $this->info("Recicláveis removidos: {$contagens['reciclaveis']}");
        $this->info('Imagens de produtos apagadas.');
        $this->info('Sistema limpo. Usuários do painel foram mantidos.');

        return self::SUCCESS;
    }
}
