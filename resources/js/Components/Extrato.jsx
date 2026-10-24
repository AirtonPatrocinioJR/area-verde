import { Link } from '@inertiajs/react';
import { formatSemente, formatValorSemente } from '@/lib/format';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardFooter } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { cn } from '@/lib/utils';

export default function Extrato({ transacoes }) {
    const items = transacoes?.data ?? [];

    if (items.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-border bg-card/50 px-4 py-8 text-center text-muted-foreground">
                Nenhuma movimentação ainda.
            </p>
        );
    }

    return (
        <Card className="gap-0 py-0">
            <CardContent className="p-0">
                <ul>
                    {items.map((t, index) => (
                        <li key={t.id}>
                            {index > 0 && <Separator />}
                            <div className="flex items-start justify-between gap-4 px-4 py-3">
                                <div>
                                    <p className="font-medium text-foreground">{t.descricao}</p>
                                    <p className="text-xs text-muted-foreground">{t.created_at}</p>
                                </div>
                                <div className="shrink-0 text-right">
                                    <p
                                        className={cn(
                                            'font-semibold tabular-nums',
                                            t.tipo === 'credito' ? 'text-primary' : 'text-soil',
                                        )}
                                    >
                                        {t.tipo === 'credito' ? '+' : '−'}
                                        {formatValorSemente(t.valor_total)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Saldo: {formatSemente(t.saldo_apos)}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
            {transacoes.links && transacoes.links.length > 3 && (
                <CardFooter className="flex flex-wrap gap-2">
                    {transacoes.links.map((link, i) =>
                        link.url ? (
                            <Button
                                key={i}
                                asChild
                                variant={link.active ? 'default' : 'ghost'}
                                size="xs"
                            >
                                <Link
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </Button>
                        ) : (
                            <span
                                key={i}
                                className="rounded px-2 py-1 text-sm text-muted-foreground/50"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ),
                    )}
                </CardFooter>
            )}
        </Card>
    );
}
