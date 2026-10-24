<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MovimentoEstoque extends Model
{
    protected $table = 'movimentos_estoque';

    public const TIPO_ENTRADA = 'entrada';

    public const TIPO_AJUSTE = 'ajuste';

    public const TIPO_VENDA = 'venda';

    protected $fillable = [
        'brinde_id',
        'user_id',
        'transacao_id',
        'tipo',
        'quantidade',
        'estoque_apos',
        'observacao',
    ];

    protected function casts(): array
    {
        return [
            'quantidade' => 'integer',
            'estoque_apos' => 'integer',
        ];
    }

    public function produto(): BelongsTo
    {
        return $this->belongsTo(Brinde::class, 'brinde_id');
    }

    public function operador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function transacao(): BelongsTo
    {
        return $this->belongsTo(Transacao::class);
    }
}
