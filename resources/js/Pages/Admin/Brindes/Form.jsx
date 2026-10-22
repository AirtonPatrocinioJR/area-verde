import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import TextInput from '../../../Components/TextInput';
import TextArea from '../../../Components/TextArea';
import PrimaryButton from '../../../Components/PrimaryButton';
import SecondaryButton from '../../../Components/SecondaryButton';

export default function Form({ brinde }) {
    const editing = Boolean(brinde);
    const { data, setData, post, put, processing, errors } = useForm({
        nome: brinde?.nome ?? '',
        descricao: brinde?.descricao ?? '',
        valor: brinde?.valor ?? '',
        estoque: brinde?.estoque ?? 0,
        ativo: brinde?.ativo ?? true,
    });

    function submit(e) {
        e.preventDefault();
        if (editing) {
            put(`/admin/brindes/${brinde.id}`);
        } else {
            post('/admin/brindes');
        }
    }

    return (
        <AdminLayout title={editing ? 'Editar brinde' : 'Novo brinde'}>
            <Head title={editing ? 'Editar brinde' : 'Novo brinde'} />
            <form
                onSubmit={submit}
                className="max-w-lg space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm"
            >
                <TextInput
                    label="Nome"
                    name="nome"
                    value={data.nome}
                    onChange={(e) => setData('nome', e.target.value)}
                    error={errors.nome}
                    required
                />
                <TextArea
                    label="Descrição"
                    name="descricao"
                    value={data.descricao}
                    onChange={(e) => setData('descricao', e.target.value)}
                    error={errors.descricao}
                />
                <TextInput
                    label="Valor (Semente)"
                    name="valor"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={data.valor}
                    onChange={(e) => setData('valor', e.target.value)}
                    error={errors.valor}
                    required
                />
                <TextInput
                    label="Estoque"
                    name="estoque"
                    type="number"
                    min="0"
                    value={data.estoque}
                    onChange={(e) => setData('estoque', e.target.value)}
                    error={errors.estoque}
                    required
                />
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={data.ativo}
                        onChange={(e) => setData('ativo', e.target.checked)}
                        className="rounded border-line text-leaf focus:ring-leaf"
                    />
                    Ativo
                </label>
                <div className="flex gap-3 pt-2">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Salvando…' : 'Salvar'}
                    </PrimaryButton>
                    <SecondaryButton href="/admin/brindes">Cancelar</SecondaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}
