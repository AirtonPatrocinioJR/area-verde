<?php

namespace App\Events;

use App\Models\Transacao;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CarteiraAtualizada implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public Transacao $transacao) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('cliente.'.$this->transacao->cliente_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'carteira.atualizada';
    }

    public function broadcastWith(): array
    {
        return [
            'cliente_id' => $this->transacao->cliente_id,
            'saldo' => $this->transacao->saldo_apos,
            'transacao' => [
                'id' => $this->transacao->id,
                'tipo' => $this->transacao->tipo,
                'descricao' => $this->transacao->descricao,
                'quantidade' => $this->transacao->quantidade,
                'valor_total' => $this->transacao->valor_total,
                'saldo_apos' => $this->transacao->saldo_apos,
                'created_at' => $this->transacao->created_at?->timezone(config('app.timezone'))->format('d/m/Y H:i'),
            ],
        ];
    }
}
