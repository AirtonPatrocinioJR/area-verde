import { Head, Link, useForm } from '@inertiajs/react';
import ClienteLayout from '../../Layouts/ClienteLayout';
import TextInput from '../../Components/TextInput';
import PrimaryButton from '../../Components/PrimaryButton';

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
            <p className="mb-6 text-muted">Acesse sua carteira com o telefone cadastrado.</p>
            <form onSubmit={submit} className="max-w-md space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
                <TextInput
                    label="Telefone"
                    name="telefone"
                    value={data.telefone}
                    onChange={(e) => setData('telefone', e.target.value)}
                    error={errors.telefone}
                    required
                    placeholder="(11) 98765-4321"
                />
                <PrimaryButton disabled={processing} className="w-full">
                    {processing ? 'Entrando…' : 'Entrar'}
                </PrimaryButton>
            </form>
            <p className="mt-4 text-sm text-muted">
                Ainda não tem carteira?{' '}
                <Link href="/cadastro" className="font-medium text-leaf hover:underline">
                    Criar carteira
                </Link>
            </p>
        </ClienteLayout>
    );
}
