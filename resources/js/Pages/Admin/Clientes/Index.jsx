import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatSemente, formatTelefone } from '@/lib/format';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Field, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';

export default function Index({ clientes, filtros }) {
    const [q, setQ] = useState(filtros?.q ?? '');

    function buscar(e) {
        e.preventDefault();
        router.get('/admin/clientes', { q }, { preserveState: true });
    }

    return (
        <AdminLayout title="Clientes">
            <Head title="Clientes" />
            <form onSubmit={buscar} className="mb-6 flex flex-wrap items-end gap-3">
                <Field className="min-w-[240px] flex-1">
                    <FieldLabel htmlFor="q">Buscar por nome ou telefone</FieldLabel>
                    <Input
                        id="q"
                        name="q"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Nome ou telefone"
                    />
                </Field>
                <Button type="submit">Buscar</Button>
            </form>
            <Card className="gap-0 overflow-hidden py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Nome</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>Saldo</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(clientes.data ?? []).map((c) => (
                            <TableRow key={c.id}>
                                <TableCell className="font-medium">{c.nome}</TableCell>
                                <TableCell>{formatTelefone(c.telefone)}</TableCell>
                                <TableCell className="tabular-nums">{formatSemente(c.saldo)}</TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="link" size="sm" className="h-auto px-0">
                                        <Link href={`/admin/clientes/${c.id}`}>Abrir</Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {(clientes.data ?? []).length === 0 && (
                    <p className="px-4 py-8 text-center text-muted-foreground">Nenhum cliente encontrado.</p>
                )}
            </Card>
        </AdminLayout>
    );
}
