import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    CalculatorIcon,
    CheckIcon,
    PlusIcon,
    Trash2Icon,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CampoNumero } from '@/Components/CampoNumero';
import { BuscaCliente } from '@/Components/admin/BuscaCliente';
import { CartaoSaldo } from '@/Components/admin/CartaoSaldo';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/Components/ui/input-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { formatFlorim, formatValorFlorim } from '@/lib/format';
import { cn } from '@/lib/utils';

function Miniatura({ src, alt = '', className }) {
    if (src) {
        return (
            <img
                src={src}
                alt={alt}
                className={cn('size-14 shrink-0 rounded-md object-cover', className)}
            />
        );
    }
    return <div className={cn('size-14 shrink-0 rounded-md bg-muted', className)} />;
}

export default function Vender({ clienteSelecionado, produtos }) {
    const [cliente, setCliente] = useState(clienteSelecionado);
    const [itens, setItens] = useState([]);
    const [produtoId, setProdutoId] = useState('');
    const [produtoSelectKey, setProdutoSelectKey] = useState(0);
    const [quantidade, setQuantidade] = useState(1);

    const form = useForm({
        cliente_id: clienteSelecionado?.id ?? '',
        itens: [],
    });

    const produto = useMemo(
        () => produtos.find((p) => String(p.id) === String(produtoId)),
        [produtos, produtoId],
    );

    const total = itens.reduce((acc, item) => acc + Number(item.valor_total), 0);
    const saldoApos = cliente ? Number(cliente.saldo) - total : null;

    function addItem() {
        if (!produto || quantidade < 1) return;
        if (quantidade > produto.estoque) return;

        const valorUnitario = Number(produto.valor);
        setItens((prev) => [
            ...prev,
            {
                key: `${produto.id}-${Date.now()}`,
                brinde_id: produto.id,
                nome: produto.nome,
                imagem_url: produto.imagem_url,
                quantidade,
                valor_unitario: valorUnitario,
                valor_total: valorUnitario * quantidade,
            },
        ]);
        setProdutoId('');
        setProdutoSelectKey((k) => k + 1);
        setQuantidade(1);
    }

    function removeItem(key) {
        setItens((prev) => prev.filter((i) => i.key !== key));
    }

    function submit(e) {
        e.preventDefault();
        if (!cliente || itens.length === 0) return;

        form.transform(() => ({
            cliente_id: cliente.id,
            itens: itens.map((i) => ({
                brinde_id: i.brinde_id,
                quantidade: i.quantidade,
            })),
        }));

        form.post('/admin/vender');
    }

    return (
        <AdminLayout
            title="Nova venda"
            subtitle="Registre uma nova venda utilizando os Florins do cliente."
        >
            <Head title="Nova venda" />

            <div className="mb-6 grid gap-4 lg:grid-cols-2">
                <Card className="relative z-10 overflow-visible">
                    <CardHeader className="pb-3">
                        <CardTitle>Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-visible">
                        <BuscaCliente
                            cliente={cliente}
                            onSelect={setCliente}
                            onClear={() => setCliente(null)}
                        />
                    </CardContent>
                </Card>
                <CartaoSaldo
                    saldo={cliente?.saldo}
                    empty={!cliente}
                    className="min-h-[7.5rem]"
                />
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Adicionar produto</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                        <Field className="min-w-0 flex-1">
                            <FieldLabel>Produto</FieldLabel>
                            <Select
                                key={produtoSelectKey}
                                value={produtoId || undefined}
                                onValueChange={setProdutoId}
                            >
                                <SelectTrigger className="h-auto min-h-10 w-full py-1.5">
                                    {produto ? (
                                        <span className="flex items-center gap-2 truncate">
                                            <Miniatura
                                                src={produto.imagem_url}
                                                className="size-8"
                                            />
                                            <span className="truncate">{produto.nome}</span>
                                        </span>
                                    ) : (
                                        <SelectValue placeholder="Selecione…" />
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    {produtos.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            <span className="flex items-center gap-2">
                                                <Miniatura
                                                    src={p.imagem_url}
                                                    className="size-8"
                                                />
                                                <span className="flex flex-col items-start leading-tight">
                                                    <span>{p.nome}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        estoque: {p.estoque}
                                                    </span>
                                                </span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field className="w-full shrink-0 lg:w-44">
                            <FieldLabel>Quantidade</FieldLabel>
                            <CampoNumero
                                value={quantidade}
                                onChange={(v) =>
                                    setQuantidade(
                                        v === '' ? 1 : Math.max(1, Number(v) || 1),
                                    )
                                }
                                min={1}
                                max={produto?.estoque}
                            />
                        </Field>

                        <Field className="w-full shrink-0 lg:w-44">
                            <FieldLabel>Valor unitário</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    readOnly
                                    value={produto ? formatValorFlorim(produto.valor) : '—'}
                                    className="tabular-nums"
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupText>Florins</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>

                        <Button
                            type="button"
                            size="lg"
                            className="shrink-0 lg:mb-0.5"
                            onClick={addItem}
                            disabled={!produto}
                        >
                            <PlusIcon />
                            Adicionar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6 gap-0 overflow-hidden py-0">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle>Itens da venda</CardTitle>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Produto</TableHead>
                            <TableHead className="text-center">Quantidade</TableHead>
                            <TableHead className="text-center">Valor unitário</TableHead>
                            <TableHead className="text-center">Subtotal</TableHead>
                            <TableHead className="w-12" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {itens.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-muted-foreground">
                                    Nenhum produto adicionado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            itens.map((item) => (
                                <TableRow key={item.key}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Miniatura src={item.imagem_url} />
                                            <span className="font-medium">{item.nome}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center tabular-nums">
                                        {item.quantidade}
                                    </TableCell>
                                    <TableCell className="text-center tabular-nums">
                                        {formatFlorim(item.valor_unitario)}
                                    </TableCell>
                                    <TableCell className="text-center tabular-nums font-semibold">
                                        {formatFlorim(item.valor_total)}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => removeItem(item.key)}
                                        >
                                            <Trash2Icon className="text-soil" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <form onSubmit={submit}>
                <FieldError className="mb-2">
                    {form.errors.itens || form.errors.cliente_id}
                </FieldError>
                <Card className="gap-0 overflow-hidden py-0">
                    <CardContent className="flex flex-col gap-0 px-0 py-0 sm:flex-row sm:items-stretch">
                        <div className="min-w-0 flex-1 space-y-4 px-5 py-5">
                            <div className="flex items-center gap-2">
                                <CalculatorIcon className="size-5 text-gold" />
                                <h3 className="text-lg font-semibold text-foreground">
                                    Resumo da venda
                                </h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-baseline justify-between gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        Total da venda
                                    </span>
                                    <span className="text-xl font-semibold tabular-nums text-leaf-dark">
                                        {formatFlorim(total)}
                                    </span>
                                </div>
                                <Separator />
                                <div className="flex items-baseline justify-between gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        Saldo após a compra
                                    </span>
                                    <span
                                        className={cn(
                                            'text-xl font-semibold tabular-nums',
                                            saldoApos != null && saldoApos < 0
                                                ? 'text-destructive'
                                                : 'text-leaf-dark',
                                        )}
                                    >
                                        {saldoApos == null ? '—' : formatFlorim(saldoApos)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full shrink-0 flex-col border-t border-border sm:w-60 sm:self-stretch sm:border-t-0 sm:border-l">
                            <Button
                                type="submit"
                                className="h-12 flex-1 rounded-none text-base sm:h-auto sm:min-h-0"
                                disabled={
                                    !cliente ||
                                    itens.length === 0 ||
                                    (saldoApos != null && saldoApos < 0) ||
                                    form.processing
                                }
                            >
                                <CheckIcon className="size-5" />
                                Confirmar venda
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 flex-1 rounded-none border-0 border-t border-border text-base sm:h-auto sm:min-h-0"
                                onClick={() => router.visit('/admin/clientes')}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AdminLayout>
    );
}
