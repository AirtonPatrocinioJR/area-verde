import { Link, usePage } from '@inertiajs/react';
import Flash from '@/Components/Flash';
import { Button } from '@/Components/ui/button';

export default function ClienteLayout({ children, title }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen">
            <header className="border-b border-border/70 bg-secondary/70 backdrop-blur-sm">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
                    <Link href="/" className="text-xl font-semibold tracking-tight text-leaf-dark">
                        Área Verde
                    </Link>
                    {auth.cliente && (
                        <div className="flex items-center gap-3 text-sm">
                            <span className="hidden text-muted-foreground sm:inline">{auth.cliente.nome}</span>
                            <Button asChild variant="link" size="sm" className="px-0">
                                <Link href="/sair" method="post" as="button">
                                    Sair
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </header>
            <main className="mx-auto max-w-3xl px-4 py-8">
                {title && (
                    <h1 className="mb-6 text-3xl font-semibold text-foreground">{title}</h1>
                )}
                <Flash />
                {children}
            </main>
        </div>
    );
}
