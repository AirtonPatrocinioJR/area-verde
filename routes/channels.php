<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('cliente.{clienteId}', function ($cliente, int $clienteId) {
    return (int) $cliente->id === $clienteId;
}, ['guards' => ['cliente']]);
