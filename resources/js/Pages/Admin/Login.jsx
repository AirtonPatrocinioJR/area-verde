import { Head, Link, useForm } from '@inertiajs/react';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Field, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { CircleAlertIcon } from 'lucide-react';

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
        <div className="flex min-h-screen items-center justify-center px-4">
            <Head title="Login operador" />
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href="/" className="text-3xl font-semibold text-leaf-dark">
                        Área Verde
                    </Link>
                    <p className="mt-2 text-muted-foreground">Acesso do operador</p>
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
                                <Label htmlFor="remember" className="text-muted-foreground font-normal">
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
    );
}
