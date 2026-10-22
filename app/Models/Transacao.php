<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transacao extends Model
{
    use HasFactory;

    protected $table = 'transacoes';

    public const TIPO_CREDITO = 'credito';

    public const TIPO_DEBITO = 'debito';

    protected $fillable = [
        'cliente_id',
        'user_id',
        'tipo',
        'reciclavel_id',
        'brinde_id',
        'quantidade',
        'valor_unitario',
        'valor_total',
        'saldo_apos',
        'descricao',
    ];

    protected function casts(): array
    {
        return [
            'quantidade' => 'decimal:2',
            'valor_unitario' => 'decimal:2',
            'valor_total' => 'decimal:2',
            'saldo_apos' => 'decimal:2',
        ];
    }

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class);
    }

    public function operador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reciclavel(): BelongsTo
    {
        return $this->belongsTo(Reciclavel::class);
    }

    public function brinde(): BelongsTo
    {
        return $this->belongsTo(Brinde::class);
    }

    public function isCredito(): bool
    {
        return $this->tipo === self::TIPO_CREDITO;
    }
}
