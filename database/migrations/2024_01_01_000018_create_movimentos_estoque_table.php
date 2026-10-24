<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimentos_estoque', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brinde_id')->constrained('brindes')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('transacao_id')->nullable()->constrained('transacoes')->nullOnDelete();
            $table->string('tipo', 20); // entrada | ajuste | venda
            $table->integer('quantidade');
            $table->integer('estoque_apos');
            $table->string('observacao')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimentos_estoque');
    }
};
