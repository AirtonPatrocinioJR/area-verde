import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    CoinsIcon,
    DownloadIcon,
    RecycleIcon,
    SearchIcon,
    ShoppingBagIcon,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Field, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { formatFlorim, formatValorFlorim } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function Index({ filtros, totais, operadores, previa }) {
    const [de, setDe] = useState(filtros.de ?? '');
    const [ate, setAte] = useState(filtros.ate ?? '');
    const [tipo, setTipo] = useState(filtros.tipo ?? 'todas');
    const [operadorId, setOperadorId] = useState(filtros.operador_id ? String(filtros.operador_id) : 'todos');

    function queryParams() {
        const params = { de, ate, tipo };
        if (operadorId && operadorId !== 'todos') {
            params.operador_id = operadorId;
        }
        return params;
    }

    function aplicar(e) {
        e.preventDefault();
        router.get('/admin/relatorios', queryParams(), { preserveState: true });
    }

    function exportUrl(tipoExport) {
        const qs = new URLSearchParams(queryParams()).toString();
        return `/admin/relatorios/exportar/${tipoExport}?${qs}`;
    }

    return (
        <AdminLayout
            title="Relatórios de movimentações"
            subtitle="Florins creditados, utilizados e exportações."
        >
            <Head title="Relatórios" />

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <form onSubmit={aplicar} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        <Field>
                            <FieldLabel htmlFor="de">De</FieldLabel>
                            <Input id="de" type="date" value={de} onChange={(e) => setDe(e.target.value)} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="ate">Até</FieldLabel>
                            <Input id="ate" type="date" value={ate} onChange={(e) => setAte(e.target.value)} />
                        </Field>
                        <Field>
                            <FieldLabel>Tipo de operação</FieldLabel>
                            <Select value={tipo} onValueChange={setTipo}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas</SelectItem>
                                    <SelectItem value="credito">Recebimento</SelectItem>
                                    <SelectItem value="debito">Venda</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <FieldLabel>Operador</FieldLabel>
                            <Select value={operadorId} onValueChange={setOperadorId}>
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos</SelectItem>
                                    {operadores.map((o) => (
                                        <SelectItem key={o.id} value={String(o.id)}>
                                            {o.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                        <div className="flex items-end">
                            <Button type="submit" className="w-full">
                                <SearchIcon />
                                Aplicar filtros
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <CardDescription>Florins creditados</CardDescription>
                            <ArrowUpIcon className="size-4 text-primary" />
                        </div>
                        <CardTitle className="text-2xl tabular-nums text-primary">
                            {formatFlorim(totais.creditados)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <CardDescription>Florins utilizados</CardDescription>
                            <ArrowDownIcon className="size-4 text-soil" />
                        </div>
                        <CardTitle className="text-2xl tabular-nums text-soil">
                            {formatFlorim(totais.utilizados)}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <CardDescription>Saldo em circulação</CardDescription>
                            <CoinsIcon className="size-4 text-gold" />
                        </div>
                        <CardTitle className="text-2xl tabular-nums text-gold">
                            {formatFlorim(totais.circulacao)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="mb-8 grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <RecycleIcon className="size-5 text-primary" />
                            <CardTitle>Recebimento de recicláveis</CardTitle>
                        </div>
                        <CardDescription>Materiais, quantidades e Florins creditados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <a href={exportUrl('recebimentos')}>
                                <DownloadIcon />
                                Exportar Excel
                            </a>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <ShoppingBagIcon className="size-5 text-gold" />
                            <CardTitle>Venda de produtos</CardTitle>
                        </div>
                        <CardDescription>Produtos, quantidades e Florins utilizados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <a href={exportUrl('vendas')}>
                                <DownloadIcon />
                                Exportar Excel
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <h2 className="mb-3 text-xl font-semibold">Movimentações (prévia)</h2>
            <Card className="gap-0 overflow-hidden py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Data e hora</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Operação</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Florins</TableHead>
                            <TableHead>Operador</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {previa.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-muted-foreground">
                                    Nenhuma movimentação no período.
                                </TableCell>
                            </TableRow>
                        ) : (
                            previa.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell>{t.created_at}</TableCell>
                                    <TableCell>{t.cliente}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={t.tipo === 'credito' ? 'default' : 'secondary'}
                                            className={
                                                t.tipo === 'debito'
                                                    ? 'bg-soil/15 text-soil hover:bg-soil/15'
                                                    : undefined
                                            }
                                        >
                                            {t.operacao}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{t.item}</TableCell>
                                    <TableCell className="tabular-nums">
                                        {t.quantidade} {t.unidade}
                                    </TableCell>
                                    <TableCell
                                        className={cn(
                                            'tabular-nums font-semibold',
                                            t.tipo === 'credito' ? 'text-primary' : 'text-soil',
                                        )}
                                    >
                                        {t.tipo === 'credito' ? '+' : '−'}
                                        {formatValorFlorim(t.valor_total)}
                                    </TableCell>
                                    <TableCell>{t.operador ?? '—'}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </AdminLayout>
    );
}
