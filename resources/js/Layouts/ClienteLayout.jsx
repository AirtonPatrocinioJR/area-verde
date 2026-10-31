import { Link, usePage } from '@inertiajs/react';
import { LogOutIcon, UserIcon, WalletIcon } from 'lucide-react';
import Flash from '@/Components/Flash';
import { BarraLogos } from '@/Components/marca/BarraLogos';
import { LogoAreaVerde } from '@/Components/marca/LogoAreaVerde';
import { Button } from '@/Components/ui/button';
import { cn } from '@/lib/utils';

export default function ClienteLayout({ children, title, showNav = true }) {
    const { auth, url } = usePage().props;
    const path = typeof window !== 'undefined' ? window.location.pathname : (url || '');
    const navVisivel = showNav && auth.cliente;

    return (
        <div className="mx-auto flex min-h-screen max-w-lg flex-col bg-background">
            <header className="flex items-center justify-between gap-4 px-4 py-4">
                <Link href="/carteira" className="flex items-center gap-2">
                    <LogoAreaVerde variant="light" className="size-12 rounded-full" />
                </Link>
                {auth.cliente && (
                    <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                        <Link href="/sair" method="post" as="button">
                            <LogOutIcon className="size-4" />
                            Sair
                        </Link>
                    </Button>
                )}
            </header>
            <main className="flex-1 px-4 pb-8">
                {title && (
                    <h1 className="mb-4 text-3xl font-semibold text-leaf-dark">{title}</h1>
                )}
                <Flash />
                {children}
            </main>
            <BarraLogos className={cn(navVisivel && 'mb-24')} />
            {navVisivel && (
                <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-lg">
                        <NavItem
                            href="/carteira"
                            icon={<WalletIcon className="size-5" />}
                            label="Carteira"
                            active={path === '/carteira'}
                        />
                        <NavItem
                            href="/meu-cadastro"
                            icon={<UserIcon className="size-5" />}
                            label="Meu cadastro"
                            active={path.startsWith('/meu-cadastro')}
                        />
                    </div>
                </nav>
            )}
        </div>
    );
}

function NavItem({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={cn(
                'flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                active
                    ? 'border-b-2 border-b-leaf-dark text-leaf-dark'
                    : 'text-muted-foreground hover:text-foreground',
            )}
        >
            {icon}
            {label}
        </Link>
    );
}
