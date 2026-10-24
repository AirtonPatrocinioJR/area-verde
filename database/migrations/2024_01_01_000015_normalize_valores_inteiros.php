<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        foreach (DB::table('reciclaveis')->get() as $row) {
            DB::table('reciclaveis')
                ->where('id', $row->id)
                ->update(['valor' => (int) round((float) $row->valor)]);
        }

        foreach (DB::table('brindes')->get() as $row) {
            DB::table('brindes')
                ->where('id', $row->id)
                ->update(['valor' => (int) round((float) $row->valor)]);
        }
    }

    public function down(): void
    {
        //
    }
};
