import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Extrato from '@/Components/Extrato';
import { formatSemente, formatTelefone } from '@/lib/format';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

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
                <Button asChild variant="outline">
                    <Link href="/admin/clientes">← Voltar</Link>
                </Button>
            </div>
            <Card className="mb-8">
                <CardHeader>
                    <p className="text-sm text-muted-foreground">{formatTelefone(cliente.telefone)}</p>
                    <CardTitle className="text-3xl text-primary">{formatSemente(cliente.saldo)}</CardTitle>
                </CardHeader>
            </Card>
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-primary">Creditar (doação)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitCredito} className="space-y-4">
                            <Field data-invalid={Boolean(credito.errors.reciclavel_id) || undefined}>
                                <FieldLabel>Reciclável</FieldLabel>
                                <Select
                                    value={credito.data.reciclavel_id || undefined}
                                    onValueChange={(value) => credito.setData('reciclavel_id', value)}
                                    required
                                >
                                    <SelectTrigger className="w-full" aria-invalid={Boolean(credito.errors.reciclavel_id)}>
                                        <SelectValue placeholder="Selecione…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reciclaveis.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>
                                                {r.nome} — {formatSemente(r.valor)}/{r.unidade}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>{credito.errors.reciclavel_id}</FieldError>
                            </Field>
                            <Field data-invalid={Boolean(credito.errors.quantidade) || undefined}>
                                <FieldLabel htmlFor="credito-quantidade">Quantidade</FieldLabel>
                                <Input
                                    id="credito-quantidade"
                                    name="quantidade"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={credito.data.quantidade}
                                    onChange={(e) => credito.setData('quantidade', e.target.value)}
                                    required
                                    aria-invalid={Boolean(credito.errors.quantidade)}
                                />
                                <FieldError>{credito.errors.quantidade}</FieldError>
                            </Field>
                            {previaCredito && (
                                <p className="text-sm text-muted-foreground">
                                    Prévia:{' '}
                                    <strong className="text-primary">{formatSemente(previaCredito.total)}</strong>
                                    {previaCredito.unidade ? ` (${previaCredito.unidade})` : ''}
                                </p>
                            )}
                            <Button type="submit" disabled={credito.processing}>
                                Registrar crédito
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-soil">Debitar (resgate)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitDebito} className="space-y-4">
                            <Field data-invalid={Boolean(debito.errors.brinde_id) || undefined}>
                                <FieldLabel>Brinde</FieldLabel>
                                <Select
                                    value={debito.data.brinde_id || undefined}
                                    onValueChange={(value) => debito.setData('brinde_id', value)}
                                    required
                                >
                                    <SelectTrigger className="w-full" aria-invalid={Boolean(debito.errors.brinde_id)}>
                                        <SelectValue placeholder="Selecione…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brindes.map((b) => (
                                            <SelectItem key={b.id} value={String(b.id)}>
                                                {b.nome} — {formatSemente(b.valor)} (estoque: {b.estoque})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError>{debito.errors.brinde_id}</FieldError>
                            </Field>
                            <Field data-invalid={Boolean(debito.errors.quantidade) || undefined}>
                                <FieldLabel htmlFor="debito-quantidade">Quantidade</FieldLabel>
                                <Input
                                    id="debito-quantidade"
                                    name="quantidade"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={debito.data.quantidade}
                                    onChange={(e) => debito.setData('quantidade', e.target.value)}
                                    required
                                    aria-invalid={Boolean(debito.errors.quantidade)}
                                />
                                <FieldError>{debito.errors.quantidade}</FieldError>
                            </Field>
                            {previaDebito && (
                                <p className="text-sm text-muted-foreground">
                                    Prévia:{' '}
                                    <strong className="text-soil">{formatSemente(previaDebito.total)}</strong>
                                    {' · '}estoque: {previaDebito.estoque}
                                </p>
                            )}
                            <Button
                                type="submit"
                                disabled={debito.processing}
                                className="bg-soil text-white hover:bg-soil/90"
                            >
                                Registrar débito
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            <h2 className="mb-3 text-xl font-semibold">Extrato</h2>
            <Extrato transacoes={transacoes} />
        </AdminLayout>
    );
}
