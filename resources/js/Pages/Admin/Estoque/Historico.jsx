import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';

const tipoLabel = {
    entrada: 'Entrada',
    ajuste: 'Ajuste',
    venda: 'Venda',
};

export default function Historico({ produto, movimentos }) {
    return (
        <AdminLayout title={`Histórico — ${produto.nome}`}>
            <Head title={`Histórico — ${produto.nome}`} />
            <div className="mb-6 flex items-center justify-between gap-4">
                <Button asChild variant="outline">
                    <Link href="/admin/estoque">← Voltar</Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                    Estoque atual: <strong className="text-foreground">{produto.estoque}</strong>
                </p>
            </div>

            <Card className="gap-0 overflow-hidden py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Data</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Estoque após</TableHead>
                            <TableHead>Operador</TableHead>
                            <TableHead>Observação</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(movimentos.data ?? []).map((m) => (
                            <TableRow key={m.id}>
                                <TableCell>{m.created_at}</TableCell>
                                <TableCell>{tipoLabel[m.tipo] ?? m.tipo}</TableCell>
                                <TableCell className="tabular-nums">
                                    {m.quantidade > 0 ? `+${m.quantidade}` : m.quantidade}
                                </TableCell>
                                <TableCell className="tabular-nums">{m.estoque_apos}</TableCell>
                                <TableCell>{m.operador ?? '—'}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {m.observacao ?? '—'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </AdminLayout>
    );
}
