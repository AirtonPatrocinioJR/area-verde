import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatFlorim } from '@/lib/format';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { Badge } from '@/Components/ui/badge';
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

export default function Index({ produtos }) {
    const [pendingId, setPendingId] = useState(null);

    function confirmDestroy() {
        if (pendingId == null) return;
        router.delete(`/admin/produtos/${pendingId}`);
        setPendingId(null);
    }

    return (
        <AdminLayout title="Produtos" subtitle="Cadastro de produtos da loja Área Verde.">
            <Head title="Produtos" />
            <div className="mb-6 flex justify-end">
                <Button asChild>
                    <Link href="/admin/produtos/create">
                        <PlusIcon />
                        Novo produto
                    </Link>
                </Button>
            </div>
            <Card className="gap-0 overflow-hidden py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Produto</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Estoque</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {produtos.map((p) => (
                            <TableRow key={p.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        {p.imagem_url ? (
                                            <img
                                                src={p.imagem_url}
                                                alt=""
                                                className="size-10 rounded-md object-cover"
                                            />
                                        ) : (
                                            <div className="size-10 rounded-md bg-muted" />
                                        )}
                                        <div>
                                            <p className="font-medium">{p.nome}</p>
                                            {p.descricao && (
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {p.descricao}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="tabular-nums">{formatFlorim(p.valor)}</TableCell>
                                <TableCell className="tabular-nums">{p.estoque}</TableCell>
                                <TableCell>
                                    <Badge variant={p.ativo ? 'default' : 'secondary'}>
                                        {p.ativo ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href={`/admin/produtos/${p.id}/edit`}>Editar</Link>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setPendingId(p.id)}
                                        >
                                            Excluir
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <AlertDialog open={pendingId != null} onOpenChange={(o) => !o && setPendingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Excluir ou desativar este produto? Esta ação não pode ser desfeita facilmente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDestroy}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
