import { Head, Link, useForm } from '@inertiajs/react';
import { PhoneIcon } from 'lucide-react';
import { AssinaturaFlorim } from '@/Components/marca/AssinaturaFlorim';
import { BarraLogos } from '@/Components/marca/BarraLogos';
import { LogoAreaVerde } from '@/Components/marca/LogoAreaVerde';
import { Button } from '@/Components/ui/button';
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
        <div className="relative flex min-h-screen flex-col">
            <Head title="Entrar" />
            <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-10">
                <div className="w-full space-y-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <LogoAreaVerde variant="light" className="size-28 rounded-full" />
                        <div>
                            <h1 className="text-3xl font-semibold text-leaf-dark">Entrar</h1>
                            <p className="mt-1 text-muted-foreground">
                                Acesse sua carteira com o WhatsApp cadastrado.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <Field data-invalid={Boolean(errors.telefone) || undefined}>
                            <FieldLabel htmlFor="telefone" className="sr-only">
                                WhatsApp
                            </FieldLabel>
                            <div className="relative">
                                <PhoneIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="telefone"
                                    name="telefone"
                                    value={data.telefone}
                                    onChange={(e) => setData('telefone', e.target.value)}
                                    required
                                    placeholder="WhatsApp"
                                    className="bg-card pl-9"
                                    aria-invalid={Boolean(errors.telefone)}
                                />
                            </div>
                            <FieldError>{errors.telefone}</FieldError>
                        </Field>
                        <Button type="submit" size="lg" className="w-full" disabled={processing}>
                            {processing ? 'Entrando…' : 'Entrar'}
                        </Button>
                        <Button asChild variant="outline" size="lg" className="w-full border-gold">
                            <Link href="/cadastro">Criar minha carteira</Link>
                        </Button>
                    </form>

                    <AssinaturaFlorim />
                </div>
            </div>
            <BarraLogos />
        </div>
    );
}
