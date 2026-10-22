import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import TextInput from '../../../Components/TextInput';
import TextArea from '../../../Components/TextArea';
import PrimaryButton from '../../../Components/PrimaryButton';
import SecondaryButton from '../../../Components/SecondaryButton';

export default function Form({ reciclavel }) {
    const editing = Boolean(reciclavel);
    const { data, setData, post, put, processing, errors } = useForm({
        nome: reciclavel?.nome ?? '',
        descricao: reciclavel?.descricao ?? '',
        valor: reciclavel?.valor ?? '',
        unidade: reciclavel?.unidade ?? '',
        ativo: reciclavel?.ativo ?? true,
    });

    function submit(e) {
        e.preventDefault();
        if (editing) {
            put(`/admin/reciclaveis/${reciclavel.id}`);
        } else {
            post('/admin/reciclaveis');
        }
    }

    return (
        <AdminLayout title={editing ? 'Editar reciclável' : 'Novo reciclável'}>
            <Head title={editing ? 'Editar reciclável' : 'Novo reciclável'} />
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
                    label="Unidade de medida"
                    name="unidade"
                    value={data.unidade}
                    onChange={(e) => setData('unidade', e.target.value)}
                    error={errors.unidade}
                    required
                    placeholder="un, kg, L…"
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
                    <SecondaryButton href="/admin/reciclaveis">Cancelar</SecondaryButton>
                </div>
            </form>
        </AdminLayout>
    );
}
