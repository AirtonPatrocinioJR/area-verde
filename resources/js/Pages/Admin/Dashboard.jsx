import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatSemente } from '@/lib/format';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { cn } from '@/lib/utils';

export default function Dashboard({ totais, ultimas }) {
    return (
        <AdminLayout title="Painel">
            <Head title="Painel" />
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <Stat label="Clientes" value={totais.clientes} />
                <Stat label="Sementes em circulação" value={formatSemente(totais.semente_circulacao)} />
                <Stat label="Transações" value={totais.transacoes} />
            </div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Últimas movimentações</h2>
                <Button asChild variant="link" size="sm" className="px-0">
                    <Link href="/admin/clientes">Buscar cliente</Link>
                </Button>
            </div>
            {ultimas.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma transação ainda.</p>
            ) : (
                <Card className="gap-0 py-0">
                    <CardContent className="p-0">
                        <ul>
                            {ultimas.map((t, index) => (
                                <li key={t.id}>
                                    {index > 0 && <Separator />}
                                    <div className="flex justify-between gap-4 px-4 py-3 text-sm">
                                        <div>
                                            <p className="font-medium">{t.descricao}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {t.cliente} · {t.created_at}
                                            </p>
                                        </div>
                                        <span
                                            className={cn(
                                                'shrink-0 font-semibold tabular-nums',
                                                t.tipo === 'credito' ? 'text-primary' : 'text-soil',
                                            )}
                                        >
                                            {t.tipo === 'credito' ? '+' : '−'}
                                            {formatSemente(t.valor_total)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
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
