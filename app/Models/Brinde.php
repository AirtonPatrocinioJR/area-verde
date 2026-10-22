<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brinde extends Model
{
    use HasFactory;

    protected $table = 'brindes';

    protected $fillable = [
        'nome',
        'descricao',
        'valor',
        'estoque',
        'ativo',
    ];

    protected function casts(): array
    {
        return [
            'valor' => 'decimal:2',
            'estoque' => 'integer',
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
