import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import TextInput from '../../../Components/TextInput';
import PrimaryButton from '../../../Components/PrimaryButton';
import { formatSemente, formatTelefone } from '../../../lib/format';

export default function Index({ clientes, filtros }) {
    const [q, setQ] = useState(filtros?.q ?? '');

    function buscar(e) {
        e.preventDefault();
        router.get('/admin/clientes', { q }, { preserveState: true });
    }

    return (
        <AdminLayout title="Clientes">
            <Head title="Clientes" />
            <form onSubmit={buscar} className="mb-6 flex flex-wrap gap-3">
                <TextInput
                    label="Buscar por nome ou telefone"
                    name="q"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Nome ou telefone"
                    className="min-w-[240px] flex-1"
                />
                <div className="flex items-end">
                    <PrimaryButton type="submit">Buscar</PrimaryButton>
                </div>
            </form>
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-line bg-cream/50 text-muted">
                        <tr>
                            <th className="px-4 py-3 font-medium">Nome</th>
                            <th className="px-4 py-3 font-medium">Telefone</th>
                            <th className="px-4 py-3 font-medium">Saldo</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {(clientes.data ?? []).map((c) => (
                            <tr key={c.id}>
                                <td className="px-4 py-3 font-medium">{c.nome}</td>
                                <td className="px-4 py-3">{formatTelefone(c.telefone)}</td>
                                <td className="px-4 py-3 tabular-nums">{formatSemente(c.saldo)}</td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/clientes/${c.id}`}
                                        className="font-medium text-leaf hover:underline"
                                    >
                                        Abrir
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(clientes.data ?? []).length === 0 && (
                    <p className="px-4 py-8 text-center text-muted">Nenhum cliente encontrado.</p>
                )}
            </div>
        </AdminLayout>
    );
}
