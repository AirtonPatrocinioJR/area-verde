<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->string('cidade')->nullable()->after('telefone');
            $table->unsignedSmallInteger('idade')->nullable()->after('cidade');
            $table->string('genero', 40)->nullable()->after('idade');
        });
    }

    public function down(): void
    {
        Schema::table('clientes', function (Blueprint $table) {
            $table->dropColumn(['cidade', 'idade', 'genero']);
        });
    }
};
