import { Head, Link, useForm } from '@inertiajs/react';
import {
    CalendarIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
    UsersIcon,
} from 'lucide-react';
import { CampoNumero } from '@/Components/CampoNumero';
import { AssinaturaFlorim } from '@/Components/marca/AssinaturaFlorim';
import { BarraLogos } from '@/Components/marca/BarraLogos';
import { LogoAreaVerde } from '@/Components/marca/LogoAreaVerde';
import { Button } from '@/Components/ui/button';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

export default function Cadastro({ generos = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        nome: '',
        telefone: '',
        cidade: '',
        idade: '',
        genero: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/cadastro');
    }

    return (
        <div className="relative flex min-h-screen flex-col">
            <Head title="Criar carteira" />
            <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-10">
                <div
                    className="pointer-events-none absolute -left-8 -top-8 size-40 opacity-30"
                    aria-hidden
                >
                    <LogoAreaVerde variant="light" className="size-full rounded-full" />
                </div>
                <div
                    className="pointer-events-none absolute -bottom-10 -right-10 size-48 opacity-25"
                    aria-hidden
                >
                    <LogoAreaVerde variant="light" className="size-full rounded-full" />
                </div>

                <div className="relative z-10 w-full max-w-md space-y-8">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <LogoAreaVerde variant="light" className="size-28 rounded-full" />
                        <div>
                            <h1 className="text-3xl font-semibold text-leaf-dark">Crie sua conta</h1>
                            <p className="mt-1 text-muted-foreground">
                                Sua carteira de Florins começa aqui.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <Field data-invalid={Boolean(errors.nome) || undefined}>
                            <FieldLabel htmlFor="nome" className="sr-only">
                                Nome completo
                            </FieldLabel>
                            <div className="relative">
                                <UserIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="nome"
                                    name="nome"
                                    value={data.nome}
                                    onChange={(e) => setData('nome', e.target.value)}
                                    required
                                    placeholder="Nome completo"
                                    className="bg-card pl-9"
                                    aria-invalid={Boolean(errors.nome)}
                                />
                            </div>
                            <FieldError>{errors.nome}</FieldError>
                        </Field>

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

                        <Field data-invalid={Boolean(errors.cidade) || undefined}>
                            <FieldLabel htmlFor="cidade" className="sr-only">
                                Cidade
                            </FieldLabel>
                            <div className="relative">
                                <MapPinIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="cidade"
                                    name="cidade"
                                    value={data.cidade}
                                    onChange={(e) => setData('cidade', e.target.value)}
                                    required
                                    placeholder="Cidade"
                                    className="bg-card pl-9"
                                    aria-invalid={Boolean(errors.cidade)}
                                />
                            </div>
                            <FieldError>{errors.cidade}</FieldError>
                        </Field>

                        <Field data-invalid={Boolean(errors.idade) || undefined}>
                            <FieldLabel htmlFor="idade" className="sr-only">
                                Idade
                            </FieldLabel>
                            <CampoNumero
                                id="idade"
                                name="idade"
                                value={data.idade}
                                onChange={(v) => setData('idade', v)}
                                min={1}
                                max={120}
                                required
                                placeholder="Idade"
                                prefix={
                                    <CalendarIcon className="size-4 text-muted-foreground" />
                                }
                                aria-invalid={Boolean(errors.idade)}
                            />
                            <FieldError>{errors.idade}</FieldError>
                        </Field>

                        <Field data-invalid={Boolean(errors.genero) || undefined}>
                            <FieldLabel className="sr-only">Gênero</FieldLabel>
                            <div className="relative">
                                <UsersIcon className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Select
                                    value={data.genero || undefined}
                                    onValueChange={(value) => setData('genero', value)}
                                    required
                                >
                                    <SelectTrigger
                                        className="w-full bg-card pl-9"
                                        aria-invalid={Boolean(errors.genero)}
                                    >
                                        <SelectValue placeholder="Gênero" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(generos).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <FieldError>{errors.genero}</FieldError>
                        </Field>

                        <Button type="submit" size="lg" className="w-full" disabled={processing}>
                            Criar minha carteira
                        </Button>

                        <Button asChild variant="outline" size="lg" className="w-full border-gold text-foreground">
                            <Link href="/entrar">Já tenho cadastro</Link>
                        </Button>
                    </form>

                    <AssinaturaFlorim />
                </div>
            </div>
            <BarraLogos />
        </div>
    );
}
