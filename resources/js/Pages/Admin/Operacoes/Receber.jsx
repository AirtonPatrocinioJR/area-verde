import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    CheckIcon,
    CoinsIcon,
    InfoIcon,
    LeafIcon,
    PlusIcon,
    RecycleIcon,
    Trash2Icon,
    WalletIcon,
} from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CampoNumero } from '@/Components/CampoNumero';
import { BuscaCliente } from '@/Components/admin/BuscaCliente';
import { CartaoSaldo } from '@/Components/admin/CartaoSaldo';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/Components/ui/tooltip';
import { formatValorFlorim, nomeFlorim } from '@/lib/format';

export default function Receber({ clienteSelecionado, reciclaveis }) {
    const [cliente, setCliente] = useState(clienteSelecionado);
    const [itens, setItens] = useState([]);
    const [materialId, setMaterialId] = useState('');
    const [materialSelectKey, setMaterialSelectKey] = useState(0);
    const [quantidade, setQuantidade] = useState('1');

    const form = useForm({
        cliente_id: clienteSelecionado?.id ?? '',
        itens: [],
    });

    const material = useMemo(
        () => reciclaveis.find((r) => String(r.id) === String(materialId)),
        [reciclaveis, materialId],
    );

    const total = itens.reduce((acc, item) => acc + Number(item.valor_total), 0);
    const saldoApos = cliente ? Number(cliente.saldo) + total : null;

    function addItem() {
        if (!material || !quantidade || Number(quantidade) <= 0) return;
        const q = Number(quantidade);
        const valorUnitario = Number(material.valor);
        setItens((prev) => [
            ...prev,
            {
                key: `${material.id}-${Date.now()}`,
                reciclavel_id: material.id,
                nome: material.nome,
                unidade: material.unidade,
                quantidade: q,
                valor_unitario: valorUnitario,
                valor_total: Math.round(valorUnitario * q * 100) / 100,
            },
        ]);
        setMaterialId('');
        setMaterialSelectKey((k) => k + 1);
        setQuantidade('1');
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
                reciclavel_id: i.reciclavel_id,
                quantidade: i.quantidade,
            })),
        }));

        form.post('/admin/receber');
    }

    return (
        <AdminLayout title="Receber recicláveis" hideTitle>
            <Head title="Receber recicláveis" />

            <div className="relative mb-6 overflow-hidden">
                <LeafIcon
                    className="pointer-events-none absolute -top-4 right-0 size-28 text-gold/15 sm:size-36"
                    aria-hidden
                />
                <div className="relative z-10 flex items-center gap-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                        Área Verde
                    </p>
                    <div className="h-0.5 w-10 bg-gold" />
                </div>
                <h1 className="relative z-10 mt-2 text-3xl font-semibold text-leaf-dark">
                    Receber recicláveis
                </h1>
                <p className="relative z-10 mt-1 max-w-xl text-sm text-muted-foreground">
                    Cadastre os materiais entregues pelo cliente e credite Florins no saldo.
                </p>
            </div>

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
                    label="Saldo atual"
                    variant="light"
                    empty={!cliente}
                    className="min-h-[7.5rem]"
                />
            </div>

            <Card className="mb-6">
                <CardHeader className="pb-3">
                    <CardTitle>Adicionar material</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                        <Field className="min-w-0 flex-1">
                            <FieldLabel>Material</FieldLabel>
                            <Select
                                key={materialSelectKey}
                                value={materialId || undefined}
                                onValueChange={setMaterialId}
                            >
                                <SelectTrigger className="h-auto min-h-10 w-full py-1.5">
                                    {material ? (
                                        <span className="flex items-center gap-2 truncate">
                                            <RecycleIcon className="size-4 shrink-0 text-primary" />
                                            <span className="truncate">{material.nome}</span>
                                        </span>
                                    ) : (
                                        <SelectValue placeholder="Selecione…" />
                                    )}
                                </SelectTrigger>
                                <SelectContent>
                                    {reciclaveis.map((r) => (
                                        <SelectItem key={r.id} value={String(r.id)}>
                                            <span className="flex items-center gap-2">
                                                <RecycleIcon className="size-4 text-primary" />
                                                {r.nome}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field className="w-full shrink-0 lg:w-28">
                            <FieldLabel>Unidade</FieldLabel>
                            <Input
                                value={material?.unidade ?? '—'}
                                disabled
                                className="bg-muted"
                            />
                        </Field>

                        <Field className="w-full shrink-0 lg:w-40">
                            <FieldLabel>Quantidade</FieldLabel>
                            <CampoNumero
                                value={quantidade}
                                onChange={setQuantidade}
                                min={0.01}
                                step={1}
                            />
                        </Field>

                        <Field className="w-full shrink-0 lg:w-44">
                            <FieldLabel className="inline-flex items-center gap-1.5">
                                Valor por unidade
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            className="text-muted-foreground hover:text-foreground"
                                            aria-label="Sobre o valor por unidade"
                                        >
                                            <InfoIcon className="size-3.5" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Valor definido no cadastro do material
                                    </TooltipContent>
                                </Tooltip>
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    readOnly
                                    value={
                                        material ? formatValorFlorim(material.valor) : '—'
                                    }
                                    className="tabular-nums"
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupText>
                                        {material ? nomeFlorim(material.valor) : 'Florins'}
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>

                        <Button
                            type="button"
                            size="lg"
                            className="shrink-0 lg:mb-0.5"
                            onClick={addItem}
                            disabled={!material}
                        >
                            <PlusIcon />
                            Adicionar material
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6 gap-0 overflow-hidden py-0">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle>Materiais para recebimento</CardTitle>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                            <TableHead>Material</TableHead>
                            <TableHead>Quantidade</TableHead>
                            <TableHead>Valor por unidade</TableHead>
                            <TableHead>Total (Florins)</TableHead>
                            <TableHead className="w-16 text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {itens.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-muted-foreground">
                                    Nenhum material adicionado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            itens.map((item) => (
                                <TableRow key={item.key}>
                                    <TableCell>
                                        <div className="flex items-center gap-2 font-medium">
                                            <RecycleIcon className="size-4 shrink-0 text-primary" />
                                            {item.nome}
                                        </div>
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {item.quantidade} {item.unidade}
                                    </TableCell>
                                    <TableCell className="tabular-nums">
                                        {formatValorFlorim(item.valor_unitario)}
                                    </TableCell>
                                    <TableCell className="tabular-nums font-semibold">
                                        {formatValorFlorim(item.valor_total)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            type="button"
                                            variant="outline"
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
                <Card className="gap-0 overflow-hidden border-primary/20 bg-primary/5 py-0">
                    <CardContent className="flex flex-col gap-0 px-0 py-0 sm:flex-row sm:items-stretch">
                        <div className="flex min-w-0 flex-1 flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-6">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                                    <CoinsIcon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Florins a creditar
                                    </p>
                                    <p className="text-xl font-semibold tabular-nums text-leaf-dark">
                                        {formatValorFlorim(total)}{' '}
                                        <span className="text-sm font-medium">
                                            {nomeFlorim(total)}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <Separator
                                orientation="vertical"
                                className="hidden h-12 bg-border sm:block"
                            />

                            <div className="flex items-center gap-3">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                                    <WalletIcon className="size-5" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Saldo após o crédito
                                    </p>
                                    <p className="text-xl font-semibold tabular-nums text-leaf-dark">
                                        {saldoApos == null ? (
                                            '—'
                                        ) : (
                                            <>
                                                {formatValorFlorim(saldoApos)}{' '}
                                                <span className="text-sm font-medium">
                                                    {nomeFlorim(saldoApos)}
                                                </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="h-14 w-full shrink-0 rounded-none text-base sm:h-auto sm:min-h-full sm:w-60 sm:self-stretch sm:px-8"
                            disabled={!cliente || itens.length === 0 || form.processing}
                        >
                            <CheckIcon className="size-5" />
                            Confirmar recebimento
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </AdminLayout>
    );
}
