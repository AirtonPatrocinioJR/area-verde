import { Head } from '@inertiajs/react';
import ClienteLayout from '../../Layouts/ClienteLayout';
import Extrato from '../../Components/Extrato';
import { formatSemente, formatTelefone } from '../../lib/format';

export default function Carteira({ cliente, transacoes }) {
    return (
        <ClienteLayout title="Minha carteira">
            <Head title="Carteira" />
            <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-leaf-dark p-6 text-white shadow-md">
                <p className="text-sm text-white/80">Saldo em Semente</p>
                <p className="font-display mt-1 text-4xl font-semibold tabular-nums">
                    {formatSemente(cliente.saldo)}
                </p>
                <p className="mt-4 text-sm text-white/70">
                    {cliente.nome} · {formatTelefone(cliente.telefone)}
                </p>
            </div>
            <h2 className="font-display mb-3 text-xl font-semibold text-ink">Extrato</h2>
            <Extrato transacoes={transacoes} />
        </ClienteLayout>
    );
}
