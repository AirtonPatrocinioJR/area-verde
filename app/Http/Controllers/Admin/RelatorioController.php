<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Transacao;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RelatorioController extends Controller
{
    public function index(Request $request): Response
    {
        $filtros = $this->filtros($request);
        $query = $this->queryBase($filtros);

        $creditados = (clone $query)->where('tipo', Transacao::TIPO_CREDITO)->sum('valor_total');
        $utilizados = (clone $query)->where('tipo', Transacao::TIPO_DEBITO)->sum('valor_total');

        $previa = (clone $query)
            ->with(['cliente:id,nome', 'operador:id,name', 'reciclavel:id,nome,unidade', 'brinde:id,nome'])
            ->latest()
            ->limit(50)
            ->get()
            ->map(fn (Transacao $t) => $this->mapLinha($t));

        return Inertia::render('Admin/Relatorios/Index', [
            'filtros' => $filtros,
            'totais' => [
                'creditados' => (float) $creditados,
                'utilizados' => (float) $utilizados,
                'circulacao' => (float) Cliente::sum('saldo'),
            ],
            'operadores' => User::query()->orderBy('name')->get(['id', 'name']),
            'previa' => $previa,
        ]);
    }

    public function exportarRecebimentos(Request $request): StreamedResponse
    {
        $filtros = $this->filtros($request);
        $filtros['tipo'] = 'credito';

        return $this->exportarCsv(
            'recebimento-reciclaveis.csv',
            $this->queryBase($filtros)
                ->with(['cliente:id,nome,telefone', 'operador:id,name', 'reciclavel:id,nome,unidade'])
                ->latest()
                ->get(),
            ['Data', 'Cliente', 'WhatsApp', 'Material', 'Quantidade', 'Unidade', 'Florins', 'Operador'],
            function (Transacao $t) {
                return [
                    $t->created_at?->format('d/m/Y H:i'),
                    $t->cliente?->nome,
                    $t->cliente?->telefone,
                    $t->reciclavel?->nome,
                    number_format((float) $t->quantidade, 2, ',', ''),
                    $t->reciclavel?->unidade,
                    number_format((float) $t->valor_total, 2, ',', ''),
                    $t->operador?->name,
                ];
            },
        );
    }

    public function exportarVendas(Request $request): StreamedResponse
    {
        $filtros = $this->filtros($request);
        $filtros['tipo'] = 'debito';

        return $this->exportarCsv(
            'venda-produtos.csv',
            $this->queryBase($filtros)
                ->with(['cliente:id,nome,telefone', 'operador:id,name', 'brinde:id,nome'])
                ->latest()
                ->get(),
            ['Data', 'Cliente', 'WhatsApp', 'Produto', 'Quantidade', 'Florins', 'Operador'],
            function (Transacao $t) {
                return [
                    $t->created_at?->format('d/m/Y H:i'),
                    $t->cliente?->nome,
                    $t->cliente?->telefone,
                    $t->brinde?->nome,
                    (string) (int) $t->quantidade,
                    number_format((float) $t->valor_total, 2, ',', ''),
                    $t->operador?->name,
                ];
            },
        );
    }

    private function filtros(Request $request): array
    {
        return [
            'de' => $request->query('de', now()->toDateString()),
            'ate' => $request->query('ate', now()->toDateString()),
            'tipo' => $request->query('tipo', 'todas'),
            'operador_id' => $request->query('operador_id', ''),
        ];
    }

    private function queryBase(array $filtros)
    {
        return Transacao::query()
            ->when(
                filled($filtros['de']),
                fn ($q) => $q->whereDate('created_at', '>=', $filtros['de']),
            )
            ->when(
                filled($filtros['ate']),
                fn ($q) => $q->whereDate('created_at', '<=', $filtros['ate']),
            )
            ->when(
                in_array($filtros['tipo'], ['credito', 'debito'], true),
                fn ($q) => $q->where('tipo', $filtros['tipo']),
            )
            ->when(
                filled($filtros['operador_id']),
                fn ($q) => $q->where('user_id', $filtros['operador_id']),
            );
    }

    private function mapLinha(Transacao $t): array
    {
        $item = $t->tipo === Transacao::TIPO_CREDITO
            ? ($t->reciclavel?->nome ?? '—')
            : ($t->brinde?->nome ?? '—');

        $unidade = $t->tipo === Transacao::TIPO_CREDITO
            ? $t->reciclavel?->unidade
            : 'un';

        return [
            'id' => $t->id,
            'created_at' => $t->created_at?->format('d/m/Y H:i'),
            'cliente' => $t->cliente?->nome,
            'operacao' => $t->tipo === Transacao::TIPO_CREDITO ? 'Recebimento' : 'Venda',
            'tipo' => $t->tipo,
            'item' => $item,
            'quantidade' => $t->quantidade,
            'unidade' => $unidade,
            'valor_total' => $t->valor_total,
            'operador' => $t->operador?->name,
        ];
    }

    /**
     * @param  \Illuminate\Support\Collection<int, Transacao>  $linhas
     * @param  list<string>  $cabecalho
     * @param  callable(Transacao): list<string|null>  $mapper
     */
    private function exportarCsv(string $filename, $linhas, array $cabecalho, callable $mapper): StreamedResponse
    {
        return response()->streamDownload(function () use ($cabecalho, $linhas, $mapper) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, $cabecalho, ';');

            foreach ($linhas as $linha) {
                fputcsv($out, $mapper($linha), ';');
            }

            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
