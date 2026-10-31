import { Head, Link, useForm } from '@inertiajs/react';
import { CircleAlertIcon } from 'lucide-react';
import { BarraLogos } from '@/Components/marca/BarraLogos';
import { LogoAreaVerde } from '@/Components/marca/LogoAreaVerde';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Field, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/admin/login');
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Head title="Login operador" />
            <div className="flex flex-1 items-center justify-center px-4 py-10">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center text-center">
                        <Link href="/">
                            <LogoAreaVerde variant="light" className="mb-4 size-24 rounded-full" />
                        </Link>
                        <h1 className="text-2xl font-semibold text-leaf-dark">Área Verde</h1>
                        <p className="mt-1 text-muted-foreground">Acesso do operador</p>
                    </div>
                    <Card>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                {errors.email && (
                                    <Alert variant="destructive">
                                        <CircleAlertIcon />
                                        <AlertDescription>{errors.email}</AlertDescription>
                                    </Alert>
                                )}
                                <Field>
                                    <FieldLabel htmlFor="email">E-mail</FieldLabel>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="password">Senha</FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                </Field>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked === true)}
                                    />
                                    <Label htmlFor="remember" className="font-normal text-muted-foreground">
                                        Lembrar de mim
                                    </Label>
                                </div>
                                <Button type="submit" disabled={processing} className="w-full">
                                    {processing ? 'Entrando…' : 'Entrar'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <BarraLogos />
        </div>
    );
}
