import { Link, usePage } from '@inertiajs/react';
import Flash from '../Components/Flash';

const nav = [
    { href: '/admin', label: 'Painel', match: (u) => u === '/admin' },
    { href: '/admin/clientes', label: 'Clientes', match: (u) => u.startsWith('/admin/clientes') },
    { href: '/admin/reciclaveis', label: 'Recicláveis', match: (u) => u.startsWith('/admin/reciclaveis') },
    { href: '/admin/brindes', label: 'Brindes', match: (u) => u.startsWith('/admin/brindes') },
];

export default function AdminLayout({ children, title }) {
    const { auth, url } = usePage().props;
    const path = typeof window !== 'undefined' ? window.location.pathname : (url || '');

    return (
        <div className="min-h-screen">
            <header className="border-b border-line bg-ink text-cream">
                <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
                    <div>
                        <Link href="/admin" className="font-display text-xl font-semibold tracking-tight">
                            Área Verde
                        </Link>
                        <p className="text-xs text-moss">Operador</p>
                    </div>
                    <nav className="flex flex-wrap gap-1 text-sm">
                        {nav.map((item) => {
                            const active = item.match(path);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`rounded-md px-3 py-1.5 transition ${
                                        active
                                            ? 'bg-leaf text-white'
                                            : 'text-cream/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-cream/70">{auth.operador?.name}</span>
                        <Link
                            href="/admin/logout"
                            method="post"
                            as="button"
                            className="rounded-md border border-cream/30 px-3 py-1 hover:bg-white/10"
                        >
                            Sair
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-5xl px-4 py-8">
                {title && (
                    <h1 className="font-display mb-6 text-3xl font-semibold text-ink">{title}</h1>
                )}
                <Flash />
                {children}
            </main>
        </div>
    );
}
