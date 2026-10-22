import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Extrato from '../../../Components/Extrato';
import TextInput from '../../../Components/TextInput';
import SelectInput from '../../../Components/SelectInput';
import PrimaryButton from '../../../Components/PrimaryButton';
import SecondaryButton from '../../../Components/SecondaryButton';
import { formatSemente, formatTelefone } from '../../../lib/format';

export default function Show({ cliente, reciclaveis, brindes, transacoes }) {
    const credito = useForm({
        reciclavel_id: '',
        quantidade: '1',
    });

    const debito = useForm({
        brinde_id: '',
        quantidade: '1',
    });

    const previaCredito = useMemo(() => {
        const item = reciclaveis.find((r) => String(r.id) === String(credito.data.reciclavel_id));
        if (!item) return null;
        const q = Number(credito.data.quantidade) || 0;
        return {
            unidade: item.unidade,
            total: Number(item.valor) * q,
        };
    }, [credito.data, reciclaveis]);

    const previaDebito = useMemo(() => {
        const item = brindes.find((b) => String(b.id) === String(debito.data.brinde_id));
        if (!item) return null;
        const q = Number(debito.data.quantidade) || 0;
        return {
            estoque: item.estoque,
            total: Number(item.valor) * q,
        };
    }, [debito.data, brindes]);

    function submitCredito(e) {
        e.preventDefault();
        credito.post(`/admin/clientes/${cliente.id}/creditar`, {
            preserveScroll: true,
            onSuccess: () => credito.reset('reciclavel_id', 'quantidade'),
        });
    }

    function submitDebito(e) {
        e.preventDefault();
        debito.post(`/admin/clientes/${cliente.id}/debitar`, {
            preserveScroll: true,
            onSuccess: () => debito.reset('brinde_id', 'quantidade'),
        });
    }

    return (
        <AdminLayout title={cliente.nome}>
            <Head title={cliente.nome} />
            <div className="mb-6">
                <SecondaryButton href="/admin/clientes">← Voltar</SecondaryButton>
            </div>
            <div className="mb-8 rounded-2xl border border-line bg-white p-6 shadow-sm">
                <p className="text-sm text-muted">{formatTelefone(cliente.telefone)}</p>
                <p className="font-display mt-1 text-3xl font-semibold text-leaf">
                    {formatSemente(cliente.saldo)}
                </p>
            </div>
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <form
                    onSubmit={submitCredito}
                    className="space-y-4 rounded-xl border border-line bg-white p-5 shadow-sm"
                >
                    <h2 className="font-display text-lg font-semibold text-leaf">Creditar (doação)</h2>
                    <SelectInput
                        label="Reciclável"
                        name="reciclavel_id"
                        value={credito.data.reciclavel_id}
                        onChange={(e) => credito.setData('reciclavel_id', e.target.value)}
                        error={credito.errors.reciclavel_id}
                        required
                    >
                        <option value="">Selecione…</option>
                        {reciclaveis.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.nome} — {formatSemente(r.valor)}/{r.unidade}
                            </option>
                        ))}
                    </SelectInput>
                    <TextInput
                        label="Quantidade"
                        name="quantidade"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={credito.data.quantidade}
                        onChange={(e) => credito.setData('quantidade', e.target.value)}
                        error={credito.errors.quantidade}
                        required
                    />
                    {previaCredito && (
                        <p className="text-sm text-muted">
                            Prévia: <strong className="text-leaf">{formatSemente(previaCredito.total)}</strong>
                            {previaCredito.unidade ? ` (${previaCredito.unidade})` : ''}
                        </p>
                    )}
                    <PrimaryButton disabled={credito.processing}>Registrar crédito</PrimaryButton>
                </form>

                <form
                    onSubmit={submitDebito}
                    className="space-y-4 rounded-xl border border-line bg-white p-5 shadow-sm"
                >
                    <h2 className="font-display text-lg font-semibold text-soil">Debitar (resgate)</h2>
                    <SelectInput
                        label="Brinde"
                        name="brinde_id"
                        value={debito.data.brinde_id}
                        onChange={(e) => debito.setData('brinde_id', e.target.value)}
                        error={debito.errors.brinde_id}
                        required
                    >
                        <option value="">Selecione…</option>
                        {brindes.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.nome} — {formatSemente(b.valor)} (estoque: {b.estoque})
                            </option>
                        ))}
                    </SelectInput>
                    <TextInput
                        label="Quantidade"
                        name="quantidade"
                        type="number"
                        min="1"
                        step="1"
                        value={debito.data.quantidade}
                        onChange={(e) => debito.setData('quantidade', e.target.value)}
                        error={debito.errors.quantidade}
                        required
                    />
                    {previaDebito && (
                        <p className="text-sm text-muted">
                            Prévia: <strong className="text-soil">{formatSemente(previaDebito.total)}</strong>
                            {' · '}estoque: {previaDebito.estoque}
                        </p>
                    )}
                    <PrimaryButton disabled={debito.processing} className="!bg-soil hover:!bg-soil/90">
                        Registrar débito
                    </PrimaryButton>
                </form>
            </div>
            <h2 className="font-display mb-3 text-xl font-semibold">Extrato</h2>
            <Extrato transacoes={transacoes} />
        </AdminLayout>
    );
}
