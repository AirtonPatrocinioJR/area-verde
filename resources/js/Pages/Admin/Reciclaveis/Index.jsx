import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import SecondaryButton from '../../../Components/SecondaryButton';
import { formatSemente } from '../../../lib/format';

export default function Index({ reciclaveis }) {
    function destroy(id) {
        if (confirm('Excluir ou desativar este reciclável?')) {
            router.delete(`/admin/reciclaveis/${id}`);
        }
    }

    return (
        <AdminLayout title="Recicláveis">
            <Head title="Recicláveis" />
            <div className="mb-6 flex justify-end">
                <SecondaryButton href="/admin/reciclaveis/create">Novo reciclável</SecondaryButton>
            </div>
            <div className="overflow-x-auto rounded-xl border border-line bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="border-b border-line bg-cream/50 text-muted">
                        <tr>
                            <th className="px-4 py-3 font-medium">Nome</th>
                            <th className="px-4 py-3 font-medium">Valor</th>
                            <th className="px-4 py-3 font-medium">Unidade</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                        {reciclaveis.map((r) => (
                            <tr key={r.id}>
                                <td className="px-4 py-3">
                                    <p className="font-medium">{r.nome}</p>
                                    {r.descricao && (
                                        <p className="text-xs text-muted line-clamp-1">{r.descricao}</p>
                                    )}
                                </td>
                                <td className="px-4 py-3 tabular-nums">{formatSemente(r.valor)}</td>
                                <td className="px-4 py-3">{r.unidade}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${
                                            r.ativo
                                                ? 'bg-leaf/15 text-leaf-dark'
                                                : 'bg-muted/15 text-muted'
                                        }`}
                                    >
                                        {r.ativo ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-3">
                                    <Link
                                        href={`/admin/reciclaveis/${r.id}/edit`}
                                        className="text-leaf hover:underline"
                                    >
                                        Editar
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => destroy(r.id)}
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
