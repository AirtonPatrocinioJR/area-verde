<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Brinde extends Model
{
    use HasFactory;

    public const ESTOQUE_BAIXO = 5;

    protected $table = 'brindes';

    protected $fillable = [
        'nome',
        'descricao',
        'imagem',
        'valor',
        'estoque',
        'ativo',
    ];

    protected $appends = [
        'imagem_url',
        'estoque_baixo',
    ];

    protected function casts(): array
    {
        return [
            'valor' => 'integer',
            'estoque' => 'integer',
            'ativo' => 'boolean',
        ];
    }

    public function transacoes(): HasMany
    {
        return $this->hasMany(Transacao::class);
    }

    public function movimentosEstoque(): HasMany
    {
        return $this->hasMany(MovimentoEstoque::class)->latest();
    }

    public function scopeAtivos($query)
    {
        return $query->where('ativo', true);
    }

    public function getImagemUrlAttribute(): ?string
    {
        if (! $this->imagem) {
            return null;
        }

        return Storage::disk('public')->url($this->imagem);
    }

    public function getEstoqueBaixoAttribute(): bool
    {
        return $this->estoque <= self::ESTOQUE_BAIXO;
    }
}
