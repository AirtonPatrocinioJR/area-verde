import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { BoxesIcon, PackageIcon, PlusIcon, SearchIcon, TriangleAlertIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CampoNumero } from '@/Components/CampoNumero';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import {
    Dialog,
    DialogContent,
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
import { cn } from '@/lib/utils';

export default function Index({ produtos, totais, filtros }) {
    const [busca, setBusca] = useState(filtros.q ?? '');
    const [entradaOpen, setEntradaOpen] = useState(false);
    const [ajusteProduto, setAjusteProduto] = useState(null);

    const entrada = useForm({
        produto_id: '',
        quantidade: '1',
        observacao: '',
    });
    const ajuste = useForm({ estoque: '', observacao: '' });

    function buscar(e) {
        e.preventDefault();
        router.get('/admin/estoque', { q: busca }, { preserveState: true });
    }

    function openEntrada() {
        entrada.setData({
            produto_id: produtos[0] ? String(produtos[0].id) : '',
            quantidade: '1',
            observacao: '',
        });
        entrada.clearErrors();
        setEntradaOpen(true);
    }

    function openAjuste(produto) {
        setAjusteProduto(produto);
        ajuste.setData({ estoque: String(produto.estoque), observacao: '' });
        ajuste.clearErrors();
    }

    function submitEntrada(e) {
        e.preventDefault();
        if (!entrada.data.produto_id) return;

        entrada.post(`/admin/estoque/${entrada.data.produto_id}/entrada`, {
            preserveScroll: true,
            onSuccess: () => setEntradaOpen(false),
        });
    }

    function submitAjuste(e) {
        e.preventDefault();
        ajuste.post(`/admin/estoque/${ajusteProduto.id}/ajustar`, {
            preserveScroll: true,
            onSuccess: () => setAjusteProduto(null),
        });
    }

    return (
        <AdminLayout title="Estoque de produtos" hideTitle>
            <Head title="Estoque" />

            <div className="mb-6">
                <h1 className="text-3xl font-semibold text-leaf-dark">Estoque de produtos</h1>
                <div className="mt-2 h-0.5 w-12 bg-gold" />
            </div>

            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <Stat
                    label="Produtos cadastrados"
                    value={totais.cadastrados}
                    icon={<PackageIcon className="size-5" />}
                    tone="primary"
                />
                <Stat
                    label="Unidades disponíveis"
                    value={totais.unidades}
                    icon={<BoxesIcon className="size-5" />}
                    tone="primary"
                />
                <Stat
                    label="Estoque baixo"
                    value={totais.estoque_baixo}
                    icon={<TriangleAlertIcon className="size-5" />}
                    tone="destructive"
                />
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <form onSubmit={buscar} className="relative flex-1">
                    <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar produto..."
                        className="h-11 bg-card pl-9"
                    />
                </form>
                <Button
                    type="button"
                    size="lg"
                    onClick={openEntrada}
                    disabled={!produtos.length}
                >
                    <PlusIcon />
                    Registrar entrada
                </Button>
            </div>

            <Card className="gap-0 overflow-hidden py-0">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Produto</TableHead>
                            <TableHead>Disponível</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {produtos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-muted-foreground">
                                    Nenhum produto encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            produtos.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {p.imagem_url ? (
                                                <img
                                                    src={p.imagem_url}
                                                    alt=""
                                                    className="size-12 rounded-md object-cover"
                                                />
                                            ) : (
                                                <div className="size-12 rounded-md bg-muted" />
                                            )}
                                            <span className="font-medium">{p.nome}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="tabular-nums">{p.estoque}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                'h-6 gap-1.5 rounded-full border-0 px-2.5 font-medium',
                                                p.estoque_baixo
                                                    ? 'bg-destructive/10 text-destructive hover:bg-destructive/10'
                                                    : 'bg-primary/10 text-primary hover:bg-primary/10',
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'size-1.5 rounded-full',
                                                    p.estoque_baixo ? 'bg-destructive' : 'bg-primary',
                                                )}
                                            />
                                            {p.estoque_baixo ? 'Estoque baixo' : 'Disponível'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button asChild variant="outline" size="sm" className="w-28">
                                                <Link href={`/admin/estoque/${p.id}/historico`}>
                                                    Ver histórico
                                                </Link>
                                            </Button>
                                            <Button
                                                type="button"
                                                size="sm"
                                                className="w-28"
                                                onClick={() => openAjuste(p)}
                                            >
                                                Ajustar
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={entradaOpen} onOpenChange={setEntradaOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Registrar entrada</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEntrada} className="space-y-4">
                        <Field data-invalid={Boolean(entrada.errors.produto_id) || undefined}>
                            <FieldLabel>Produto</FieldLabel>
                            <Select
                                value={entrada.data.produto_id || undefined}
                                onValueChange={(value) => entrada.setData('produto_id', value)}
                                required
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {produtos.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.nome} (estoque: {p.estoque})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FieldError>{entrada.errors.produto_id}</FieldError>
                        </Field>
                        <Field data-invalid={Boolean(entrada.errors.quantidade) || undefined}>
                            <FieldLabel htmlFor="entrada-qtd">Quantidade</FieldLabel>
                            <CampoNumero
                                id="entrada-qtd"
                                value={entrada.data.quantidade}
                                onChange={(v) => entrada.setData('quantidade', v)}
                                min={1}
                                required
                                aria-invalid={Boolean(entrada.errors.quantidade)}
                            />
                            <FieldError>{entrada.errors.quantidade}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="entrada-obs">Observação</FieldLabel>
                            <Input
                                id="entrada-obs"
                                value={entrada.data.observacao}
                                onChange={(e) => entrada.setData('observacao', e.target.value)}
                            />
                        </Field>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setEntradaOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={entrada.processing || !entrada.data.produto_id}>
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={Boolean(ajusteProduto)} onOpenChange={(o) => !o && setAjusteProduto(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajustar estoque — {ajusteProduto?.nome}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitAjuste} className="space-y-4">
                        <Field data-invalid={Boolean(ajuste.errors.estoque) || undefined}>
                            <FieldLabel htmlFor="ajuste-estoque">Novo estoque</FieldLabel>
                            <CampoNumero
                                id="ajuste-estoque"
                                value={ajuste.data.estoque}
                                onChange={(v) => ajuste.setData('estoque', v)}
                                min={0}
                                required
                                aria-invalid={Boolean(ajuste.errors.estoque)}
                            />
                            <FieldError>{ajuste.errors.estoque}</FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="ajuste-obs">Observação</FieldLabel>
                            <Input
                                id="ajuste-obs"
                                value={ajuste.data.observacao}
                                onChange={(e) => ajuste.setData('observacao', e.target.value)}
                            />
                        </Field>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setAjusteProduto(null)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={ajuste.processing}>
                                Confirmar
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

function Stat({ label, value, icon, tone = 'primary' }) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 pt-6">
                <div
                    className={cn(
                        'flex size-12 shrink-0 items-center justify-center rounded-full',
                        tone === 'destructive'
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-primary/10 text-primary',
                    )}
                >
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}
