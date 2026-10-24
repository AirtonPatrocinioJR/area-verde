import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowDownLeftIcon, ArrowUpRightIcon } from 'lucide-react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import Extrato from '@/Components/Extrato';
import { MedalhaoFlorim } from '@/Components/marca/LogoAreaVerde';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { formatFlorim, formatValorFlorim, nomeFlorim } from '@/lib/format';
import { cn } from '@/lib/utils';

export default function Carteira({ cliente, totais, filtro = 'tudo', transacoes }) {
    const [aoVivo, setAoVivo] = useState(false);
    const primeiroNome = (cliente.nome || '').split(/\s+/)[0] || 'visitante';

    useEffect(() => {
        if (!cliente?.id || !window.Echo) {
            return undefined;
        }

        const canal = `cliente.${cliente.id}`;

        window.Echo.private(canal).listen('.carteira.atualizada', () => {
            router.reload({
                only: ['cliente', 'transacoes', 'totais'],
                preserveScroll: true,
            });
        });

        setAoVivo(true);

        return () => {
            window.Echo.leave(canal);
            setAoVivo(false);
        };
    }, [cliente.id]);

    return (
        <ClienteLayout>
            <Head title="Carteira" />
            <p className="text-muted-foreground">
                Olá, <span className="font-medium text-foreground">{primeiroNome}</span>
            </p>
            <div className="mb-2 flex items-center justify-between gap-2">
                <h1 className="text-3xl font-semibold text-leaf-dark">Minha carteira</h1>
                {aoVivo && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                        <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                        Ao vivo
                    </Badge>
                )}
            </div>

            <div className="mb-4 overflow-hidden rounded-2xl bg-leaf-dark p-5 text-primary-foreground shadow-md">
                <div className="flex items-center gap-4">
                    <MedalhaoFlorim size="lg" />
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-primary-foreground/70">
                            Saldo disponível
                        </p>
                        <p className="mt-1 text-3xl font-semibold tabular-nums">
                            {formatValorFlorim(cliente.saldo)}{' '}
                            <span className="text-gold">{nomeFlorim(cliente.saldo)}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-3">
                <Card className="py-3">
                    <CardContent className="px-4 py-0">
                        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ArrowDownLeftIcon className="size-3.5 text-primary" />
                            Recebidos
                        </div>
                        <p className="font-semibold tabular-nums text-primary">
                            {formatFlorim(totais.recebidos)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="py-3">
                    <CardContent className="px-4 py-0">
                        <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ArrowUpRightIcon className="size-3.5 text-soil" />
                            Utilizados
                        </div>
                        <p className="font-semibold tabular-nums text-soil">
                            {formatFlorim(totais.utilizados)}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-3 flex gap-2">
                {[
                    { key: 'tudo', label: 'Tudo' },
                    { key: 'entradas', label: 'Entradas' },
                    { key: 'compras', label: 'Compras' },
                ].map((tab) => (
                    <Button
                        key={tab.key}
                        asChild
                        size="sm"
                        variant={filtro === tab.key ? 'default' : 'outline'}
                        className={cn(filtro === tab.key && 'bg-leaf-dark hover:bg-leaf-dark/90')}
                    >
                        <Link href={`/carteira?filtro=${tab.key}`} preserveScroll>
                            {tab.label}
                        </Link>
                    </Button>
                ))}
            </div>

            <Extrato transacoes={transacoes} />
        </ClienteLayout>
    );
}
