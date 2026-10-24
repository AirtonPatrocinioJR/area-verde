import { Head, Link } from '@inertiajs/react';
import { LeafIcon, RecycleIcon, ShoppingBagIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatFlorim, formatValorFlorim } from '@/lib/format';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { cn } from '@/lib/utils';

export default function Dashboard({ totais, ultimas }) {
    return (
        <AdminLayout title="Painel">
            <Head title="Painel" />
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <Stat label="Clientes" value={totais.clientes} />
                <Stat label="Florins em circulação" value={formatFlorim(totais.florim_circulacao)} />
                <Stat label="Transações" value={totais.transacoes} />
            </div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">Últimas movimentações</h2>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/admin/receber">
                            <RecycleIcon />
                            Receber recicláveis
                        </Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/admin/vender">
                            <ShoppingBagIcon />
                            Nova venda
                        </Link>
                    </Button>
                </div>
            </div>
            {ultimas.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma transação ainda.</p>
            ) : (
                <ul className="space-y-2">
                    {ultimas.map((t) => {
                        const isCredito = t.tipo === 'credito';
                        return (
                            <li key={t.id}>
                                <Card className="py-3">
                                    <CardContent className="flex items-center gap-3 px-4 py-0">
                                        <div
                                            className={cn(
                                                'flex size-10 shrink-0 items-center justify-center rounded-full',
                                                isCredito
                                                    ? 'bg-primary/15 text-primary'
                                                    : 'bg-soil/15 text-soil',
                                            )}
                                        >
                                            {isCredito ? (
                                                <LeafIcon className="size-4" />
                                            ) : (
                                                <ShoppingBagIcon className="size-4" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-foreground">
                                                {t.descricao}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {t.cliente} · {t.created_at}
                                            </p>
                                        </div>
                                        <p
                                            className={cn(
                                                'shrink-0 font-semibold tabular-nums',
                                                isCredito ? 'text-primary' : 'text-soil',
                                            )}
                                        >
                                            {isCredito ? '+' : '−'}
                                            {formatValorFlorim(t.valor_total)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </li>
                        );
                    })}
                </ul>
            )}
        </AdminLayout>
    );
}

function Stat({ label, value }) {
    return (
        <Card>
            <CardHeader className="pb-0">
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
            </CardHeader>
        </Card>
    );
}
