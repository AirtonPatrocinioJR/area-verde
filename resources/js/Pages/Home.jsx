import { Head, Link } from '@inertiajs/react';

export default function Home() {
    return (
        <>
            <Head title="Início" />
            <div className="relative flex min-h-screen flex-col overflow-hidden">
                <div
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%232f6b3a\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    }}
                />
                <header className="relative z-10 mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-6">
                    <span className="font-display text-2xl font-semibold text-leaf-dark">Área Verde</span>
                    <Link href="/admin/login" className="text-sm text-muted hover:text-leaf">
                        Área do operador
                    </Link>
                </header>
                <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 pb-16 pt-8">
                    <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-moss">
                        Carteira em recicláveis
                    </p>
                    <h1 className="font-display max-w-xl text-5xl font-semibold leading-tight text-ink sm:text-6xl">
                        Transforme recicláveis em{' '}
                        <span className="text-leaf">Semente</span>
                    </h1>
                    <p className="mt-5 max-w-lg text-lg text-muted">
                        Doe materiais recicláveis, acumule Semente e resgate brindes. Sua carteira digital
                        sustentável.
                    </p>
                    <div className="mt-10 flex flex-wrap gap-3">
                        <Link
                            href="/cadastro"
                            className="inline-flex rounded-lg bg-leaf px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-dark"
                        >
                            Criar minha carteira
                        </Link>
                        <Link
                            href="/entrar"
                            className="inline-flex rounded-lg border border-line bg-white/80 px-6 py-3 text-sm font-semibold text-ink transition hover:border-leaf hover:text-leaf"
                        >
                            Entrar
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}
