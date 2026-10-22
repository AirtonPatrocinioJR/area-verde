<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reciclavel extends Model
{
    use HasFactory;

    protected $table = 'reciclaveis';

    protected $fillable = [
        'nome',
        'descricao',
        'valor',
        'unidade',
        'ativo',
    ];

    protected function casts(): array
    {
        return [
            'valor' => 'decimal:2',
            'ativo' => 'boolean',
        ];
    }

    public function transacoes(): HasMany
    {
        return $this->hasMany(Transacao::class);
    }

    public function scopeAtivos($query)
    {
        return $query->where('ativo', true);
    }
}
