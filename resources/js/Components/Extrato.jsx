import { Link } from '@inertiajs/react';
import { LeafIcon, ShoppingBagIcon } from 'lucide-react';
import { formatValorFlorim } from '@/lib/format';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
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
        <div>
            <ul className="space-y-2">
                {items.map((t) => {
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
                                            {t.rotulo}
                                            <span className="text-muted-foreground">
                                                {' '}
                                                · {t.item}
                                            </span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {t.created_at}
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

            {transacoes.links && transacoes.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-2">
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
                </div>
            )}
        </div>
    );
}
