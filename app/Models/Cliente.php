<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Cliente extends Authenticatable
{
    use HasFactory;

    protected $table = 'clientes';

    public const GENEROS = [
        'feminino' => 'Feminino',
        'masculino' => 'Masculino',
        'outro' => 'Outro',
        'nao_informar' => 'Prefiro não informar',
    ];

    protected $fillable = [
        'nome',
        'telefone',
        'cidade',
        'idade',
        'genero',
        'saldo',
    ];

    protected $hidden = [
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'saldo' => 'decimal:2',
            'idade' => 'integer',
        ];
    }

    public function transacoes(): HasMany
    {
        return $this->hasMany(Transacao::class)->latest();
    }

    public static function normalizarTelefone(string $telefone): string
    {
        return preg_replace('/\D+/', '', $telefone) ?? '';
    }

    public function setTelefoneAttribute(string $value): void
    {
        $this->attributes['telefone'] = self::normalizarTelefone($value);
    }

    public function generoLabel(): ?string
    {
        if ($this->genero === null) {
            return null;
        }

        return self::GENEROS[$this->genero] ?? $this->genero;
    }
}
