import { Head, Link } from '@inertiajs/react';
import { AssinaturaFlorim } from '@/Components/marca/AssinaturaFlorim';
import { BarraLogos } from '@/Components/marca/BarraLogos';
import { LogoAreaVerde } from '@/Components/marca/LogoAreaVerde';
import { Button } from '@/Components/ui/button';

export default function Home() {
    return (
        <>
            <Head title="Início" />
            <div className="relative flex min-h-screen flex-col">
                <div
                    className="pointer-events-none absolute -left-8 -top-8 size-48 opacity-25"
                    aria-hidden
                >
                    <LogoAreaVerde variant="light" className="size-full rounded-full" />
                </div>
                <header className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-6">
                    <LogoAreaVerde variant="light" className="size-14 rounded-full" />
                    <Button asChild variant="link" size="sm" className="text-muted-foreground">
                        <Link href="/admin/login">Área do operador</Link>
                    </Button>
                </header>
                <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 pb-16 pt-8">
                    <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold">
                        Área Verde · Flor Atlântica
                    </p>
                    <h1 className="max-w-xl text-5xl font-semibold leading-tight text-leaf-dark sm:text-6xl">
                        Transforme recicláveis em{' '}
                        <span className="text-gold">Florins</span>
                    </h1>
                    <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                        Entregue materiais recicláveis, acumule Florins e compre produtos na loja.
                        A moeda digital do Flor Atlântica.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <Button asChild size="lg">
                            <Link href="/cadastro">Criar minha carteira</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg" className="border-gold">
                            <Link href="/entrar">Entrar</Link>
                        </Button>
                    </div>
                    <AssinaturaFlorim className="mt-16 items-start" />
                </main>
                <BarraLogos />
            </div>
        </>
    );
}
