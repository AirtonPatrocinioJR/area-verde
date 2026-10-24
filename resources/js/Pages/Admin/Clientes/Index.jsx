import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { ChevronRightIcon, SearchIcon, UsersIcon, XIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from '@/Components/ui/input-group';
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

export default function Index({ clientes, filtros }) {
    const [q, setQ] = useState(filtros?.q ?? '');
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
                                : 'Clientes aparecem aqui após o cadastro pela carteira.'}
                        </p>
                    </div>
                    {filtroAtivo && (
                        <Button type="button" variant="outline" onClick={limpar}>
                            Limpar busca
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
        </AdminLayout>
    );
}
