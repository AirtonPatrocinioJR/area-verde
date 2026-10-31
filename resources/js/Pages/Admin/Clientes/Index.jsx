import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRightIcon, PlusIcon, SearchIcon, UsersIcon, XIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CampoNumero } from '@/Components/CampoNumero';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
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
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/Components/ui/input-group';
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
import { formatFlorim, formatTelefone } from '@/lib/format';
import { cn } from '@/lib/utils';

function initials(name) {
    if (!name) return '?';
    return name
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export default function Index({ clientes, filtros, generos = {} }) {
    const [q, setQ] = useState(filtros?.q ?? '');
    const [formOpen, setFormOpen] = useState(false);
    const items = clientes.data ?? [];
    const filtroAtivo = Boolean((filtros?.q ?? '').trim());
    const total = clientes.total ?? items.length;

    function buscar(e) {
        e.preventDefault();
        router.get('/admin/clientes', { q: q.trim() || undefined }, { preserveState: true });
    }

    function limpar() {
        setQ('');
        router.get('/admin/clientes', {}, { preserveState: true });
    }

    return (
        <AdminLayout
            title="Clientes"
            subtitle="Busque e abra a ficha para receber materiais ou vender produtos."
        >
            <Head title="Clientes" />

            <form onSubmit={buscar} className="mb-3">
                <div className="flex flex-wrap items-center gap-2">
                    <InputGroup className="h-10 min-w-[240px] flex-1">
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                        <InputGroupInput
                            id="q"
                            name="q"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Nome ou WhatsApp"
                            aria-label="Buscar por nome ou WhatsApp"
                        />
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton type="submit">Buscar</InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                    {filtroAtivo && (
                        <Button type="button" variant="ghost" onClick={limpar}>
                            <XIcon />
                            Limpar
                        </Button>
                    )}
                    <Button type="button" onClick={() => setFormOpen(true)}>
                        <PlusIcon />
                        Novo cliente
                    </Button>
                </div>
            </form>

            <p className="mb-4 text-sm text-muted-foreground">
                {filtroAtivo
                    ? `${total} resultado${total === 1 ? '' : 's'} para “${filtros.q.trim()}”`
                    : `${total} cliente${total === 1 ? '' : 's'}`}
            </p>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-4 py-16 text-center">
                    <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <UsersIcon className="size-6" />
                    </div>
                    <div>
                        <p className="font-medium text-foreground">
                            {filtroAtivo
                                ? 'Nenhum cliente encontrado'
                                : 'Nenhum cliente cadastrado'}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {filtroAtivo
                                ? 'Tente outro nome ou WhatsApp.'
                                : 'Cadastre o primeiro cliente para começar a receber materiais.'}
                        </p>
                    </div>
                    {filtroAtivo ? (
                        <Button type="button" variant="outline" onClick={limpar}>
                            Limpar busca
                        </Button>
                    ) : (
                        <Button type="button" onClick={() => setFormOpen(true)}>
                            <PlusIcon />
                            Novo cliente
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <Card className="gap-0 overflow-hidden py-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>WhatsApp</TableHead>
                                    <TableHead>Saldo</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((c) => (
                                    <TableRow
                                        key={c.id}
                                        className="cursor-pointer"
                                        onClick={() => router.visit(`/admin/clientes/${c.id}`)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback className="bg-primary/15 text-xs text-primary">
                                                        {initials(c.nome)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0">
                                                    <p className="font-medium">{c.nome}</p>
                                                    {c.cidade && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {c.cidade}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="tabular-nums text-muted-foreground">
                                            {formatTelefone(c.telefone)}
                                        </TableCell>
                                        <TableCell
                                            className={cn(
                                                'tabular-nums font-medium',
                                                Number(c.saldo) > 0
                                                    ? 'text-leaf-dark'
                                                    : 'text-muted-foreground',
                                            )}
                                        >
                                            {formatFlorim(c.saldo)}
                                        </TableCell>
                                        <TableCell
                                            className="text-right"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/admin/clientes/${c.id}`}>
                                                    Abrir
                                                    <ChevronRightIcon />
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {clientes.links && clientes.links.length > 3 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {clientes.links.map((link, i) =>
                                link.url ? (
                                    <Button
                                        key={i}
                                        asChild
                                        variant={link.active ? 'default' : 'ghost'}
                                        size="xs"
                                    >
                                        <Link
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </Button>
                                ) : (
                                    <span
                                        key={i}
                                        className="rounded px-2 py-1 text-sm text-muted-foreground/50"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ),
                            )}
                        </div>
                    )}
                </>
            )}

            <ClienteFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                generos={generos}
            />
        </AdminLayout>
    );
}

function ClienteFormDialog({ open, onOpenChange, generos }) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nome: '',
        telefone: '',
        cidade: '',
        idade: '',
        genero: '',
    });

    function handleOpenChange(nextOpen) {
        if (!nextOpen) {
            reset();
            clearErrors();
        }
        onOpenChange(nextOpen);
    }

    function submit(e) {
        e.preventDefault();
        post('/admin/clientes', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
                onOpenChange(false);
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Novo cliente</DialogTitle>
                    <DialogDescription>
                        Cadastre a carteira do cliente. Ele poderá entrar depois com o WhatsApp.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <Field data-invalid={Boolean(errors.nome) || undefined}>
                        <FieldLabel htmlFor="cliente-nome">Nome completo</FieldLabel>
                        <Input
                            id="cliente-nome"
                            name="nome"
                            value={data.nome}
                            onChange={(e) => setData('nome', e.target.value)}
                            required
                            aria-invalid={Boolean(errors.nome)}
                        />
                        <FieldError>{errors.nome}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.telefone) || undefined}>
                        <FieldLabel htmlFor="cliente-telefone">WhatsApp</FieldLabel>
                        <Input
                            id="cliente-telefone"
                            name="telefone"
                            value={data.telefone}
                            onChange={(e) => setData('telefone', e.target.value)}
                            required
                            placeholder="(11) 98765-4321"
                            aria-invalid={Boolean(errors.telefone)}
                        />
                        <FieldError>{errors.telefone}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.cidade) || undefined}>
                        <FieldLabel htmlFor="cliente-cidade">Cidade</FieldLabel>
                        <Input
                            id="cliente-cidade"
                            name="cidade"
                            value={data.cidade}
                            onChange={(e) => setData('cidade', e.target.value)}
                            required
                            aria-invalid={Boolean(errors.cidade)}
                        />
                        <FieldError>{errors.cidade}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.idade) || undefined}>
                        <FieldLabel htmlFor="cliente-idade">Idade</FieldLabel>
                        <CampoNumero
                            id="cliente-idade"
                            name="idade"
                            value={data.idade}
                            onChange={(v) => setData('idade', v)}
                            min={1}
                            max={120}
                            required
                            aria-invalid={Boolean(errors.idade)}
                        />
                        <FieldError>{errors.idade}</FieldError>
                    </Field>
                    <Field data-invalid={Boolean(errors.genero) || undefined}>
                        <FieldLabel>Gênero</FieldLabel>
                        <Select
                            value={data.genero || undefined}
                            onValueChange={(value) => setData('genero', value)}
                            required
                        >
                            <SelectTrigger
                                className="w-full"
                                aria-invalid={Boolean(errors.genero)}
                            >
                                <SelectValue placeholder="Selecione…" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(generos).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError>{errors.genero}</FieldError>
                    </Field>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Salvando…' : 'Cadastrar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
