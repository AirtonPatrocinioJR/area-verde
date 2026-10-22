import { Head, Link, useForm } from '@inertiajs/react';
import TextInput from '../../Components/TextInput';
import PrimaryButton from '../../Components/PrimaryButton';

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
                    <Link href="/" className="font-display text-3xl font-semibold text-leaf-dark">
                        Área Verde
                    </Link>
                    <p className="mt-2 text-muted">Acesso do operador</p>
                </div>
                <form
                    onSubmit={submit}
                    className="space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm"
                >
                    {errors.email && (
                        <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                            {errors.email}
                        </div>
                    )}
                    <TextInput
                        label="E-mail"
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <TextInput
                        label="Senha"
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <label className="flex items-center gap-2 text-sm text-muted">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded border-line text-leaf focus:ring-leaf"
                        />
                        Lembrar de mim
                    </label>
                    <PrimaryButton disabled={processing} className="w-full">
                        {processing ? 'Entrando…' : 'Entrar'}
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}
