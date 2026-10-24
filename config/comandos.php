<?php

return [

    'prontos' => [
        [
            'comando' => 'app:limpar-dados --force',
            'titulo' => 'Limpar dados',
            'descricao' => 'Apaga clientes, transações, movimentos de estoque, produtos (e imagens) e recicláveis. Reinicia os IDs. Usuários do painel são mantidos.',
            'destrutivo' => true,
        ],
        [
            'comando' => 'cache:clear',
            'titulo' => 'Limpar cache',
            'descricao' => 'Remove o cache da aplicação.',
            'destrutivo' => false,
        ],
        [
            'comando' => 'config:clear',
            'titulo' => 'Limpar config',
            'descricao' => 'Remove o cache de configuração.',
            'destrutivo' => false,
        ],
        [
            'comando' => 'route:clear',
            'titulo' => 'Limpar rotas',
            'descricao' => 'Remove o cache de rotas.',
            'destrutivo' => false,
        ],
        [
            'comando' => 'view:clear',
            'titulo' => 'Limpar views',
            'descricao' => 'Remove as views compiladas.',
            'destrutivo' => false,
        ],
        [
            'comando' => 'optimize:clear',
            'titulo' => 'Limpar otimizações',
            'descricao' => 'Remove todos os caches de otimização.',
            'destrutivo' => false,
        ],
        [
            'comando' => 'optimize',
            'titulo' => 'Otimizar',
            'descricao' => 'Gera caches de configuração e rotas para produção.',
            'destrutivo' => false,
        ],
        [
            'comando' => 'storage:link',
            'titulo' => 'Link do storage',
            'descricao' => 'Cria o link simbólico public/storage.',
            'destrutivo' => false,
        ],
        [
            'comando' => 'migrate --force',
            'titulo' => 'Rodar migrations',
            'descricao' => 'Executa as migrations pendentes sem confirmação.',
            'destrutivo' => false,
        ],
        [
            'comando' => 'db:seed --force',
            'titulo' => 'Rodar seeders',
            'descricao' => 'Executa os seeders. Pode sobrescrever ou criar dados de exemplo.',
            'destrutivo' => false,
        ],
    ],

    'bloqueados' => [
        'db:wipe',
        'migrate:fresh',
        'migrate:reset',
        'migrate:rollback',
        'tinker',
        'serve',
        'queue:work',
        'queue:listen',
        'schedule:work',
        'schedule:run',
        'reverb:start',
        'pail',
        'down',
        'key:generate',
        'env',
    ],

];
