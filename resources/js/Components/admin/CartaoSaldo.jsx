import { LeafIcon } from 'lucide-react';
import { MedalhaoFlorim } from '@/Components/marca/LogoAreaVerde';
import { formatValorFlorim, nomeFlorim } from '@/lib/format';
import { cn } from '@/lib/utils';

export function CartaoSaldo({
    saldo,
    label = 'Saldo disponível',
    variant = 'dark',
    empty = false,
    className,
}) {
    const isDark = variant === 'dark';
    const valor = empty || saldo == null ? null : Number(saldo);

    if (!isDark) {
        return (
            <div
                className={cn(
                    'relative flex items-center gap-4 overflow-hidden rounded-2xl border border-gold/50 bg-secondary/40 p-5',
                    className,
                )}
            >
                <MedalhaoFlorim size="xl" className="relative z-10 shrink-0" />
                <div className="relative z-10 h-14 w-px shrink-0 bg-gold/50" aria-hidden />
                <div className="relative z-10 min-w-0">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground">{label}</p>
                    {valor == null ? (
                        <p className="mt-1 text-sm text-muted-foreground">Selecione um cliente</p>
                    ) : (
                        <p className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
                            <span className="text-4xl font-semibold tabular-nums tracking-tight text-leaf-dark">
                                {formatValorFlorim(valor)}
                            </span>
                            <span className="text-sm font-medium text-leaf-dark/80">
                                {nomeFlorim(valor)}
                            </span>
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'relative flex items-center gap-4 overflow-hidden rounded-2xl border border-gold/30 bg-leaf-dark p-5 text-primary-foreground',
                className,
            )}
        >
            <LeafIcon
                className="pointer-events-none absolute -right-2 -bottom-2 size-28 text-gold/15"
                aria-hidden
            />
            <MedalhaoFlorim size="xl" className="relative z-10" />
            <div className="relative z-10 min-w-0">
                <p className="text-xs font-medium tracking-wide text-primary-foreground/80">{label}</p>
                {valor == null ? (
                    <p className="mt-1 text-sm text-primary-foreground/70">Selecione um cliente</p>
                ) : (
                    <>
                        <p className="mt-0.5 text-4xl font-semibold tabular-nums tracking-tight text-gold">
                            {formatValorFlorim(valor)}
                        </p>
                        <p className="text-sm font-medium text-gold">{nomeFlorim(valor)}</p>
                    </>
                )}
            </div>
        </div>
    );
}
