import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { ImageIcon, SaveIcon, Trash2Icon, UploadCloudIcon } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';
import { CampoNumero } from '@/Components/CampoNumero';
import { MedalhaoFlorim } from '@/Components/marca/LogoAreaVerde';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from '@/Components/ui/input-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Separator } from '@/Components/ui/separator';

function Obrigatorio() {
    return <span className="text-destructive">*</span>;
}

export default function Form({ produto }) {
    const isEditing = Boolean(produto);
    const titulo = isEditing ? 'Editar produto' : 'Cadastrar produto';
    const [preview, setPreview] = useState(produto?.imagem_url ?? null);
    const fileRef = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        nome: produto?.nome ?? '',
        descricao: produto?.descricao ?? '',
        valor: produto?.valor ?? '',
        estoque: produto?.estoque ?? 0,
        ativo: produto?.ativo ?? true,
        imagem: null,
        remover_imagem: false,
        _method: isEditing ? 'put' : undefined,
    });

    function submit(e) {
        e.preventDefault();
        if (isEditing) {
            post(`/admin/produtos/${produto.id}`, { forceFormData: true });
        } else {
            post('/admin/produtos', { forceFormData: true });
        }
    }

    function onImageChange(e) {
        const file = e.target.files?.[0] ?? null;
        setData((prev) => ({ ...prev, imagem: file, remover_imagem: false }));
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
        e.target.value = '';
    }

    function removeImage() {
        setData((prev) => ({ ...prev, imagem: null, remover_imagem: true }));
        setPreview(null);
    }

    return (
        <AdminLayout
            title={titulo}
            hideTitle
            breadcrumbs={[
                { label: 'Produtos', href: '/admin/produtos' },
                { label: isEditing ? 'Editar produto' : 'Novo produto' },
            ]}
        >
            <Head title={titulo} />

            <div className="mb-2">
                <h1 className="text-3xl font-semibold text-leaf-dark md:text-4xl">{titulo}</h1>
                <div className="mt-3 h-0.5 w-10 bg-gold" />
            </div>

            <form onSubmit={submit}>
                <Card>
                    <CardContent className="space-y-6">
                        <div className="grid gap-8 lg:grid-cols-[1fr_auto_18rem]">
                            <div className="space-y-5">
                                <Field data-invalid={Boolean(errors.nome) || undefined}>
                                    <FieldLabel htmlFor="nome">
                                        Nome do produto <Obrigatorio />
                                    </FieldLabel>
                                    <Input
                                        id="nome"
                                        value={data.nome}
                                        onChange={(e) => setData('nome', e.target.value)}
                                        required
                                        className="h-10"
                                        aria-invalid={Boolean(errors.nome)}
                                    />
                                    <FieldError>{errors.nome}</FieldError>
                                </Field>

                                <Field data-invalid={Boolean(errors.descricao) || undefined}>
                                    <FieldLabel htmlFor="descricao">Descrição</FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            id="descricao"
                                            value={data.descricao ?? ''}
                                            maxLength={200}
                                            rows={4}
                                            onChange={(e) => setData('descricao', e.target.value)}
                                            aria-invalid={Boolean(errors.descricao)}
                                        />
                                        <InputGroupAddon align="block-end" className="justify-end">
                                            <InputGroupText className="text-xs tabular-nums">
                                                {(data.descricao || '').length}/200
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldError>{errors.descricao}</FieldError>
                                </Field>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <Field data-invalid={Boolean(errors.valor) || undefined}>
                                        <FieldLabel htmlFor="valor">
                                            Valor em Florins <Obrigatorio />
                                        </FieldLabel>
                                        <CampoNumero
                                            id="valor"
                                            value={data.valor}
                                            onChange={(v) => setData('valor', v)}
                                            min={1}
                                            required
                                            prefix={<MedalhaoFlorim size="sm" className="size-6" />}
                                            aria-invalid={Boolean(errors.valor)}
                                        />
                                        <FieldError>{errors.valor}</FieldError>
                                    </Field>

                                    {!isEditing && (
                                        <Field data-invalid={Boolean(errors.estoque) || undefined}>
                                            <FieldLabel htmlFor="estoque">
                                                Estoque inicial <Obrigatorio />
                                            </FieldLabel>
                                            <CampoNumero
                                                id="estoque"
                                                value={data.estoque}
                                                onChange={(v) => setData('estoque', v)}
                                                min={0}
                                                required
                                                aria-invalid={Boolean(errors.estoque)}
                                            />
                                            <FieldError>{errors.estoque}</FieldError>
                                        </Field>
                                    )}
                                </div>

                                <Field>
                                    <FieldLabel>
                                        Status <Obrigatorio />
                                    </FieldLabel>
                                    <Select
                                        value={data.ativo ? 'ativo' : 'inativo'}
                                        onValueChange={(v) => setData('ativo', v === 'ativo')}
                                    >
                                        <SelectTrigger className="w-full data-[size=default]:h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ativo">Ativo</SelectItem>
                                            <SelectItem value="inativo">Inativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>

                            <Separator orientation="vertical" className="hidden lg:block" />

                            <div className="space-y-2">
                                <FieldLabel>Imagem do produto</FieldLabel>
                                <div className="overflow-hidden rounded-xl border border-border bg-secondary/40 p-2">
                                    <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-background">
                                        {preview ? (
                                            <>
                                                <img
                                                    src={preview}
                                                    alt=""
                                                    className="size-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon-sm"
                                                    className="absolute top-2 right-2 rounded-full bg-background shadow-sm"
                                                    onClick={removeImage}
                                                    aria-label="Remover imagem"
                                                >
                                                    <Trash2Icon className="text-destructive" />
                                                </Button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
                                                <ImageIcon className="size-8" />
                                                Nenhuma imagem
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="mt-2 w-full"
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        <UploadCloudIcon />
                                        {preview ? 'Trocar imagem' : 'Enviar imagem'}
                                    </Button>
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg"
                                        className="hidden"
                                        onChange={onImageChange}
                                    />
                                </div>
                                <p className="text-center text-xs text-muted-foreground">
                                    Formatos aceitos: JPG, PNG. Tamanho máximo: 5 MB.
                                </p>
                                <FieldError>{errors.imagem}</FieldError>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex flex-wrap gap-3">
                            <Button type="submit" size="lg" disabled={processing}>
                                <SaveIcon />
                                Salvar produto
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <Link href="/admin/produtos">Cancelar</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </AdminLayout>
    );
}
