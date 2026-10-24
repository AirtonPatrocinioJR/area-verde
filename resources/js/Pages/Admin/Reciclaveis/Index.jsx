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

export default function Index({ reciclaveis }) {
    const [pendingId, setPendingId] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    function openCreate() {
        setEditing(null);
        setFormOpen(true);
    }

    function openEdit(reciclavel) {
        setEditing(reciclavel);
        setFormOpen(true);
    }

    function closeForm() {
        setFormOpen(false);
        setEditing(null);
    }

    function confirmDestroy() {
        if (pendingId == null) return;
        router.delete(`/admin/reciclaveis/${pendingId}`);
        setPendingId(null);
    }

    return (
        <AdminLayout title="Recicláveis">
            <Head title="Recicláveis" />
            <div className="mb-6 flex justify-end">
                <Button type="button" variant="outline" onClick={openCreate}>
                    Novo reciclável
                </Button>
            </div>
            <Card className="gap-0 overflow-hidden py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Nome</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Unidade</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reciclaveis.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>
                                    <p className="font-medium">{r.nome}</p>
                                    {r.descricao && (
                                        <p className="line-clamp-1 text-xs text-muted-foreground">{r.descricao}</p>
                                    )}
                                </TableCell>
                                <TableCell className="tabular-nums">{formatSemente(r.valor)}</TableCell>
                                <TableCell>{r.unidade}</TableCell>
                                <TableCell>
                                    <Badge variant={r.ativo ? 'default' : 'secondary'}>
                                        {r.ativo ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="space-x-2 text-right">
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto px-0"
                                        onClick={() => openEdit(r)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto px-0 text-destructive"
                                        onClick={() => setPendingId(r.id)}
                                    >
                                        Excluir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <ReciclavelFormDialog
                key={editing?.id ?? 'create'}
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) closeForm();
                    else setFormOpen(true);
                }}
                reciclavel={editing}
                onSuccess={closeForm}
            />

            <AlertDialog open={pendingId != null} onOpenChange={(open) => !open && setPendingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir reciclável?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Excluir ou desativar este reciclável? Esta ação não pode ser desfeita facilmente.
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

function ReciclavelFormDialog({ open, onOpenChange, reciclavel, onSuccess }) {
    const isEditing = Boolean(reciclavel);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nome: reciclavel?.nome ?? '',
        descricao: reciclavel?.descricao ?? '',
        valor: reciclavel?.valor ?? '',
        unidade: reciclavel?.unidade ?? '',
        ativo: reciclavel?.ativo ?? true,
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
            put(`/admin/reciclaveis/${reciclavel.id}`, options);
        } else {
            post('/admin/reciclaveis', options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar reciclável' : 'Novo reciclável'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Atualize os dados do reciclável e o valor em Sementes.'
                            : 'Cadastre um reciclável aceito nas doações.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <Field data-invalid={Boolean(errors.nome) || undefined}>
                        <FieldLabel htmlFor="reciclavel-nome">Nome</FieldLabel>
                        <Input
                            id="reciclavel-nome"
                            name="nome"
                            value={data.nome}
                            onChange={(e) => setData('nome', e.target.value)}
                            required
                            aria-invalid={Boolean(errors.nome)}
                        />
                        <FieldError>{errors.nome}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.descricao) || undefined}>
                        <FieldLabel htmlFor="reciclavel-descricao">Descrição</FieldLabel>
                        <Textarea
                            id="reciclavel-descricao"
                            name="descricao"
                            value={data.descricao}
                            onChange={(e) => setData('descricao', e.target.value)}
                            aria-invalid={Boolean(errors.descricao)}
                        />
                        <FieldError>{errors.descricao}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.valor) || undefined}>
                        <FieldLabel htmlFor="reciclavel-valor">Valor (Sementes)</FieldLabel>
                        <Input
                            id="reciclavel-valor"
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
                    <Field data-invalid={Boolean(errors.unidade) || undefined}>
                        <FieldLabel htmlFor="reciclavel-unidade">Unidade de medida</FieldLabel>
                        <Input
                            id="reciclavel-unidade"
                            name="unidade"
                            value={data.unidade}
                            onChange={(e) => setData('unidade', e.target.value)}
                            required
                            placeholder="un, kg, L…"
                            aria-invalid={Boolean(errors.unidade)}
                        />
                        <FieldError>{errors.unidade}</FieldError>
                    </Field>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="reciclavel-ativo"
                            checked={data.ativo}
                            onCheckedChange={(checked) => setData('ativo', checked === true)}
                        />
                        <Label htmlFor="reciclavel-ativo" className="font-normal">
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
