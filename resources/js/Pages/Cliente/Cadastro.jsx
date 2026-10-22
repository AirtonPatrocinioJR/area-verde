import { Head, Link, useForm } from '@inertiajs/react';
import ClienteLayout from '../../Layouts/ClienteLayout';
import TextInput from '../../Components/TextInput';
import PrimaryButton from '../../Components/PrimaryButton';

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
            <p className="mb-6 text-muted">
                Informe nome e telefone para abrir sua carteira em Semente.
            </p>
            <form onSubmit={submit} className="max-w-md space-y-4 rounded-xl border border-line bg-white p-6 shadow-sm">
                <TextInput
                    label="Nome"
                    name="nome"
                    value={data.nome}
                    onChange={(e) => setData('nome', e.target.value)}
                    error={errors.nome}
                    required
                    placeholder="Seu nome completo"
                />
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
                    {processing ? 'Criando…' : 'Criar carteira'}
                </PrimaryButton>
            </form>
            <p className="mt-4 text-sm text-muted">
                Já tem carteira?{' '}
                <Link href="/entrar" className="font-medium text-leaf hover:underline">
                    Entrar
                </Link>
            </p>
        </ClienteLayout>
    );
}
