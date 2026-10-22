import { Link, usePage } from '@inertiajs/react';
import Flash from '../Components/Flash';

export default function ClienteLayout({ children, title }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen">
            <header className="border-b border-line/70 bg-cream/70 backdrop-blur-sm">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
                    <Link href="/" className="font-display text-xl font-semibold tracking-tight text-leaf-dark">
                        Área Verde
                    </Link>
                    {auth.cliente && (
                        <div className="flex items-center gap-3 text-sm">
                            <span className="hidden text-muted sm:inline">{auth.cliente.nome}</span>
                            <Link
                                href="/sair"
                                method="post"
                                as="button"
                                className="text-leaf underline-offset-2 hover:text-leaf-dark hover:underline"
                            >
                                Sair
                            </Link>
                        </div>
                    )}
                </div>
            </header>
            <main className="mx-auto max-w-3xl px-4 py-8">
                {title && (
                    <h1 className="font-display mb-6 text-3xl font-semibold text-ink">{title}</h1>
                )}
                <Flash />
                {children}
            </main>
        </div>
    );
}
