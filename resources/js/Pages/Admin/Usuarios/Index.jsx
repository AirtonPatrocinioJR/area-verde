import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';

const papelLabel = {
    admin: 'Admin',
    operador: 'Operador',
};

export default function Index({ usuarios }) {
    const { auth } = usePage().props;
    const [pendingId, setPendingId] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    function openCreate() {
        setEditing(null);
        setFormOpen(true);
    }

    function openEdit(usuario) {
        setEditing(usuario);
        setFormOpen(true);
    }

    function closeForm() {
        setFormOpen(false);
        setEditing(null);
    }

    function confirmDestroy() {
        if (pendingId == null) return;
        router.delete(`/admin/usuarios/${pendingId}`);
        setPendingId(null);
    }

    return (
        <AdminLayout title="Usuários">
            <Head title="Usuários" />
            <div className="mb-6 flex justify-end">
                <Button type="button" variant="outline" onClick={openCreate}>
                    Novo usuário
                </Button>
            </div>
            <Card className="gap-0 overflow-hidden py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Nome</TableHead>
                            <TableHead>E-mail</TableHead>
                            <TableHead>Papel</TableHead>
                            <TableHead className="text-right"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usuarios.map((u) => (
                            <TableRow key={u.id}>
                                <TableCell className="font-medium">{u.name}</TableCell>
                                <TableCell>{u.email}</TableCell>
                                <TableCell>
                                    <Badge variant={u.papel === 'admin' ? 'default' : 'secondary'}>
                                        {papelLabel[u.papel] ?? u.papel}
                                    </Badge>
                                </TableCell>
                                <TableCell className="space-x-2 text-right">
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="h-auto px-0"
                                        onClick={() => openEdit(u)}
                                    >
                                        Editar
                                    </Button>
                                    {auth.operador?.id !== u.id && (
                                        <Button
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            className="h-auto px-0 text-destructive"
                                            onClick={() => setPendingId(u.id)}
                                        >
                                            Excluir
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <UsuarioFormDialog
                key={editing?.id ?? 'create'}
                open={formOpen}
                onOpenChange={(open) => {
                    if (!open) closeForm();
                    else setFormOpen(true);
                }}
                usuario={editing}
                onSuccess={closeForm}
            />

            <AlertDialog open={pendingId != null} onOpenChange={(open) => !open && setPendingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação remove o acesso do usuário ao painel. Não pode ser desfeita.
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

function UsuarioFormDialog({ open, onOpenChange, usuario, onSuccess }) {
    const isEditing = Boolean(usuario);
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: usuario?.name ?? '',
        email: usuario?.email ?? '',
        password: '',
        papel: usuario?.papel ?? 'operador',
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
            put(`/admin/usuarios/${usuario.id}`, options);
        } else {
            post('/admin/usuarios', options);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Atualize os dados do usuário do painel.'
                            : 'Crie um operador ou administrador.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <Field data-invalid={Boolean(errors.name) || undefined}>
                        <FieldLabel htmlFor="usuario-name">Nome</FieldLabel>
                        <Input
                            id="usuario-name"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            aria-invalid={Boolean(errors.name)}
                        />
                        <FieldError>{errors.name}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.email) || undefined}>
                        <FieldLabel htmlFor="usuario-email">E-mail</FieldLabel>
                        <Input
                            id="usuario-email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            aria-invalid={Boolean(errors.email)}
                        />
                        <FieldError>{errors.email}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.password) || undefined}>
                        <FieldLabel htmlFor="usuario-password">
                            Senha{isEditing ? ' (deixe em branco para manter)' : ''}
                        </FieldLabel>
                        <Input
                            id="usuario-password"
                            name="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required={!isEditing}
                            autoComplete="new-password"
                            aria-invalid={Boolean(errors.password)}
                        />
                        <FieldError>{errors.password}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.papel) || undefined}>
                        <FieldLabel>Papel</FieldLabel>
                        <Select value={data.papel} onValueChange={(value) => setData('papel', value)}>
                            <SelectTrigger aria-invalid={Boolean(errors.papel)} className="w-full">
                                <SelectValue placeholder="Selecione…" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="operador">Operador</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <FieldError>{errors.papel}</FieldError>
                    </Field>
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
