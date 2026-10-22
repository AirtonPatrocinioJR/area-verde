import { Head, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { formatSemente } from '../../lib/format';

export default function Dashboard({ totais, ultimas }) {
    return (
        <AdminLayout title="Painel">
            <Head title="Painel" />
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <Stat label="Clientes" value={totais.clientes} />
                <Stat label="Semente em circulação" value={formatSemente(totais.semente_circulacao)} />
                <Stat label="Transações" value={totais.transacoes} />
            </div>
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Últimas movimentações</h2>
                <Link href="/admin/clientes" className="text-sm font-medium text-leaf hover:underline">
                    Buscar cliente
                </Link>
            </div>
            {ultimas.length === 0 ? (
                <p className="text-muted">Nenhuma transação ainda.</p>
            ) : (
                <div className="overflow-hidden rounded-xl border border-line bg-white">
                    <ul className="divide-y divide-line">
                        {ultimas.map((t) => (
                            <li key={t.id} className="flex justify-between gap-4 px-4 py-3 text-sm">
                                <div>
                                    <p className="font-medium">{t.descricao}</p>
                                    <p className="text-xs text-muted">
                                        {t.cliente} · {t.created_at}
                                    </p>
                                </div>
                                <span
                                    className={`shrink-0 font-semibold tabular-nums ${
                                        t.tipo === 'credito' ? 'text-leaf' : 'text-soil'
                                    }`}
                                >
                                    {t.tipo === 'credito' ? '+' : '−'}
                                    {formatSemente(t.valor_total)}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </AdminLayout>
    );
}

function Stat({ label, value }) {
    return (
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <p className="text-sm text-muted">{label}</p>
            <p className="font-display mt-1 text-2xl font-semibold tabular-nums text-ink">{value}</p>
        </div>
    );
}
