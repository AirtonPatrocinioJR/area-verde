import { Head, Link, useForm } from '@inertiajs/react';
import ClienteLayout from '@/Layouts/ClienteLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        telefone: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/entrar');
    }

    return (
        <ClienteLayout title="Entrar">
            <Head title="Entrar" />
            <p className="mb-6 text-muted-foreground">Acesse sua carteira com o telefone cadastrado.</p>
            <Card className="max-w-md">
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
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
                            {processing ? 'Entrando…' : 'Entrar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <p className="mt-4 text-sm text-muted-foreground">
                Ainda não tem carteira?{' '}
                <Button asChild variant="link" size="sm" className="h-auto px-0">
                    <Link href="/cadastro">Criar carteira</Link>
                </Button>
            </p>
        </ClienteLayout>
    );
}
