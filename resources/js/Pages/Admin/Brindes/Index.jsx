import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { formatSemente } from '@/lib/format';
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
import { Checkbox } from '@/Components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';

export default function Index({ brindes }) {
    const [pendingId, setPendingId] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    function openCreate() {
        setEditing(null);
        setFormOpen(true);
    }

    function openEdit(brinde) {
        setEditing(brinde);
        setFormOpen(true);
    }

    function closeForm() {
        setFormOpen(false);
        setEditing(null);
    }

    function confirmDestroy() {
        if (pendingId == null) return;
        router.delete(`/admin/brindes/${pendingId}`);
        setPendingId(null);
    }

    return (
        <AdminLayout title="Brindes">
            <Head title="Brindes" />
            <div className="mb-6 flex justify-end">
                <Button type="button" variant="outline" onClick={openCreate}>
                    Novo brinde
                </Button>
            </div>
            <Card className="gap-0 overflow-hidden py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Nome</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Estoque</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {brindes.map((b) => (
                            <TableRow key={b.id}>
                                <TableCell>
                                    <p className="font-medium">{b.nome}</p>
                                    {b.descricao && (
                                        <p className="line-clamp-1 text-xs text-muted-foreground">{b.descricao}</p>
                                    )}
                                </TableCell>
                                <TableCell className="tabular-nums">{formatSemente(b.valor)}</TableCell>
                                <TableCell className="tabular-nums">{b.estoque}</TableCell>
                                <TableCell>
                                    <Badge variant={b.ativo ? 'default' : 'secondary'}>
                                        {b.ativo ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="space-x-2 text-right">
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto px-0"
                                        onClick={() => openEdit(b)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto px-0 text-destructive"
                                        onClick={() => setPendingId(b.id)}
                                    >
                                        Excluir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <BrindeFormDialog
                key={editing?.id ?? 'create'}
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) closeForm();
                    else setFormOpen(true);
                }}
                brinde={editing}
                onSuccess={closeForm}
            />

            <AlertDialog open={pendingId != null} onOpenChange={(open) => !open && setPendingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir brinde?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Excluir ou desativar este brinde? Esta ação não pode ser desfeita facilmente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction variant="destructive" onClick={confirmDestroy}>
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}

function BrindeFormDialog({ open, onOpenChange, brinde, onSuccess }) {
    const isEditing = Boolean(brinde);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nome: brinde?.nome ?? '',
        descricao: brinde?.descricao ?? '',
        valor: brinde?.valor ?? '',
        estoque: brinde?.estoque ?? 0,
        ativo: brinde?.ativo ?? true,
    });

    function submit(e) {
        e.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                onSuccess();
            },
        };

        if (isEditing) {
            put(`/admin/brindes/${brinde.id}`, options);
        } else {
            post('/admin/brindes', options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar brinde' : 'Novo brinde'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Atualize os dados do brinde e o estoque disponível.'
                            : 'Cadastre um brinde resgatável com Sementes.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <Field data-invalid={Boolean(errors.nome) || undefined}>
                        <FieldLabel htmlFor="brinde-nome">Nome</FieldLabel>
                        <Input
                            id="brinde-nome"
                            name="nome"
                            value={data.nome}
                            onChange={(e) => setData('nome', e.target.value)}
                            required
                            aria-invalid={Boolean(errors.nome)}
                        />
                        <FieldError>{errors.nome}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.descricao) || undefined}>
                        <FieldLabel htmlFor="brinde-descricao">Descrição</FieldLabel>
                        <Textarea
                            id="brinde-descricao"
                            name="descricao"
                            value={data.descricao}
                            onChange={(e) => setData('descricao', e.target.value)}
                            aria-invalid={Boolean(errors.descricao)}
                        />
                        <FieldError>{errors.descricao}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.valor) || undefined}>
                        <FieldLabel htmlFor="brinde-valor">Valor (Sementes)</FieldLabel>
                        <Input
                            id="brinde-valor"
                            name="valor"
                            type="number"
                            step="1"
                            min="1"
                            inputMode="numeric"
                            value={data.valor}
                            onChange={(e) => setData('valor', e.target.value)}
                            required
                            aria-invalid={Boolean(errors.valor)}
                        />
                        <FieldError>{errors.valor}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.estoque) || undefined}>
                        <FieldLabel htmlFor="brinde-estoque">Estoque</FieldLabel>
                        <Input
                            id="brinde-estoque"
                            name="estoque"
                            type="number"
                            min="0"
                            value={data.estoque}
                            onChange={(e) => setData('estoque', e.target.value)}
                            required
                            aria-invalid={Boolean(errors.estoque)}
                        />
                        <FieldError>{errors.estoque}</FieldError>
                    </Field>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="brinde-ativo"
                            checked={data.ativo}
                            onCheckedChange={(checked) => setData('ativo', checked === true)}
                        />
                        <Label htmlFor="brinde-ativo" className="font-normal">
                            Ativo
                        </Label>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Salvando…' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
