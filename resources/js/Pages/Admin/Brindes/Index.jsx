import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import SecondaryButton from '../../../Components/SecondaryButton';
import { formatSemente } from '../../../lib/format';

export default function Index({ brindes }) {
    function destroy(id) {
        if (confirm('Excluir ou desativar este brinde?')) {
            router.delete(`/admin/brindes/${id}`);
        }
    }

    return (
        <AdminLayout title="Brindes">
            <Head title="Brindes" />
            <div className="mb-6 flex justify-end">
                <SecondaryButton href="/admin/brindes/create">Novo brinde</SecondaryButton>
            </div>
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-line bg-cream/50 text-muted">
                        <tr>
                            <th className="px-4 py-3 font-medium">Nome</th>
                            <th className="px-4 py-3 font-medium">Valor</th>
                            <th className="px-4 py-3 font-medium">Estoque</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {brindes.map((b) => (
                            <tr key={b.id}>
                                <td className="px-4 py-3">
                                    <p className="font-medium">{b.nome}</p>
                                    {b.descricao && (
                                        <p className="text-xs text-muted line-clamp-1">{b.descricao}</p>
                                    )}
                                </td>
                                <td className="px-4 py-3 tabular-nums">{formatSemente(b.valor)}</td>
                                <td className="px-4 py-3 tabular-nums">{b.estoque}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${
                                            b.ativo
                                                ? 'bg-leaf/15 text-leaf-dark'
                                                : 'bg-muted/15 text-muted'
                                        }`}
                                    >
                                        {b.ativo ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="space-x-3 px-4 py-3 text-right">
                                    <Link
                                        href={`/admin/brindes/${b.id}/edit`}
                                        className="text-leaf hover:underline"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => destroy(b.id)}
                                        className="text-danger hover:underline"
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
