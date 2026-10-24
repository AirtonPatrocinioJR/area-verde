import { Head, Link, useForm } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';

export default function Cadastro() {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        telefone: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/cadastro');
    }

    return (
        <ClienteLayout title="Criar carteira">
            <Head title="Cadastro" />
            <p className="mb-6 text-muted-foreground">
                Informe nome e telefone para abrir sua carteira em Semente.
            </p>
            <Card className="max-w-md">
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <Field data-invalid={Boolean(errors.nome) || undefined}>
                            <FieldLabel htmlFor="nome">Nome</FieldLabel>
                            <Input
                                id="nome"
                                name="nome"
                                value={data.nome}
                                onChange={(e) => setData('nome', e.target.value)}
                                required
                                placeholder="Seu nome completo"
                                aria-invalid={Boolean(errors.nome)}
                            />
                            <FieldError>{errors.nome}</FieldError>
                        </Field>
                        <Field data-invalid={Boolean(errors.telefone) || undefined}>
                            <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
                            <Input
                                id="telefone"
                                name="telefone"
                                value={data.telefone}
                                onChange={(e) => setData('telefone', e.target.value)}
                                required
                                placeholder="(11) 98765-4321"
                                aria-invalid={Boolean(errors.telefone)}
                            />
                            <FieldError>{errors.telefone}</FieldError>
                        </Field>
                        <Button type="submit" disabled={processing} className="w-full">
                            {processing ? 'Criando…' : 'Criar carteira'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <p className="mt-4 text-sm text-muted-foreground">
                Já tem carteira?{' '}
                <Button asChild variant="link" size="sm" className="h-auto px-0">
                    <Link href="/entrar">Entrar</Link>
                </Button>
            </p>
        </ClienteLayout>
    );
}
