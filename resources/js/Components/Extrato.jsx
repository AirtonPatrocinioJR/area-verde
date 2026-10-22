import { Link } from '@inertiajs/react';
import { formatSemente } from '../lib/format';

export default function Extrato({ transacoes }) {
    const items = transacoes?.data ?? [];

    if (items.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-line bg-white/50 px-4 py-8 text-center text-muted">
                Nenhuma movimentação ainda.
            </p>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-line bg-white">
            <ul className="divide-y divide-line">
                {items.map((t) => (
                    <li key={t.id} className="flex items-start justify-between gap-4 px-4 py-3">
                        <div>
                            <p className="font-medium text-ink">{t.descricao}</p>
                            <p className="text-xs text-muted">{t.created_at}</p>
                        </div>
                        <div className="shrink-0 text-right">
                            <p
                                className={`font-semibold tabular-nums ${
                                    t.tipo === 'credito' ? 'text-leaf' : 'text-soil'
                                }`}
                            >
                                {t.tipo === 'credito' ? '+' : '−'}
                                {formatSemente(t.valor_total).replace(' Semente', '')}
                            </p>
                            <p className="text-xs text-muted">Saldo: {formatSemente(t.saldo_apos)}</p>
                        </div>
                    </li>
                ))}
            </ul>
            {transacoes.links && transacoes.links.length > 3 && (
                <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
                    {transacoes.links.map((link, i) =>
                        link.url ? (
                            <Link
                                key={i}
                                href={link.url}
                                className={`rounded px-2 py-1 text-sm ${
                                    link.active ? 'bg-leaf text-white' : 'text-muted hover:text-leaf'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ) : (
                            <span
                                key={i}
                                className="rounded px-2 py-1 text-sm text-muted/50"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ),
                    )}
                </div>
            )}
        </div>
    );
}
