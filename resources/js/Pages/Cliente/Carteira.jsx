import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import Extrato from '@/Components/Extrato';
import { Badge } from '@/Components/ui/badge';
import { formatSemente, formatTelefone } from '@/lib/format';

export default function Carteira({ cliente, transacoes }) {
    const [aoVivo, setAoVivo] = useState(false);

    useEffect(() => {
        if (!cliente?.id || !window.Echo) {
            return undefined;
        }

        const canal = `cliente.${cliente.id}`;

        window.Echo.private(canal)
            .listen('.carteira.atualizada', () => {
                router.reload({
                    only: ['cliente', 'transacoes'],
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
        <ClienteLayout title="Minha carteira">
            <Head title="Carteira" />
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-leaf-dark p-6 text-primary-foreground shadow-md">
                <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-primary-foreground/80">Saldo em Sementes</p>
                    {aoVivo && (
                        <Badge variant="secondary" className="bg-white/15 text-primary-foreground hover:bg-white/15">
                            <span className="size-1.5 animate-pulse rounded-full bg-emerald-300" />
                            Ao vivo
                        </Badge>
                    )}
                </div>
                <p className="mt-1 text-4xl font-semibold tabular-nums">
                    {formatSemente(cliente.saldo)}
                </p>
                <p className="mt-4 text-sm text-primary-foreground/70">
                    {cliente.nome} · {formatTelefone(cliente.telefone)}
                </p>
            </div>
            <h2 className="mb-3 text-xl font-semibold text-foreground">Extrato</h2>
            <Extrato transacoes={transacoes} />
        </ClienteLayout>
    );
}
