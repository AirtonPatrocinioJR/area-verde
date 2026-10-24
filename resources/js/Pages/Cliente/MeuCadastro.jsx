import { Head, useForm } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import { CampoNumero } from '@/Components/CampoNumero';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { formatTelefone } from '@/lib/format';

export default function MeuCadastro({ cliente, generos = {} }) {
    const { data, setData, put, processing, errors } = useForm({
        nome: cliente.nome ?? '',
        cidade: cliente.cidade ?? '',
        idade: cliente.idade ?? '',
        genero: cliente.genero ?? '',
    });

    function submit(e) {
        e.preventDefault();
        put('/meu-cadastro');
    }

    return (
        <ClienteLayout title="Meu cadastro">
            <Head title="Meu cadastro" />
            <Card>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <Field data-invalid={Boolean(errors.nome) || undefined}>
                            <FieldLabel htmlFor="nome">Nome completo</FieldLabel>
                            <Input
                                id="nome"
                                value={data.nome}
                                onChange={(e) => setData('nome', e.target.value)}
                                required
                                aria-invalid={Boolean(errors.nome)}
                            />
                            <FieldError>{errors.nome}</FieldError>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="telefone">WhatsApp</FieldLabel>
                            <Input
                                id="telefone"
                                value={formatTelefone(cliente.telefone)}
                                disabled
                                className="bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">
                                O WhatsApp identifica sua carteira e não pode ser alterado.
                            </p>
                        </Field>

                        <Field data-invalid={Boolean(errors.cidade) || undefined}>
                            <FieldLabel htmlFor="cidade">Cidade</FieldLabel>
                            <Input
                                id="cidade"
                                value={data.cidade}
                                onChange={(e) => setData('cidade', e.target.value)}
                                required
                                aria-invalid={Boolean(errors.cidade)}
                            />
                            <FieldError>{errors.cidade}</FieldError>
                        </Field>

                        <Field data-invalid={Boolean(errors.idade) || undefined}>
                            <FieldLabel htmlFor="idade">Idade</FieldLabel>
                            <CampoNumero
                                id="idade"
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
                                <SelectTrigger className="w-full" aria-invalid={Boolean(errors.genero)}>
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

                        <Button type="submit" disabled={processing} className="w-full">
                            Salvar alterações
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </ClienteLayout>
    );
}
