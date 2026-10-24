import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDownIcon, LogOutIcon } from 'lucide-react';
import { MedalhaoFlorim } from '@/Components/marca/LogoAreaVerde';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';

function initials(name) {
    if (!name) return '?';
    return name
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function HeaderUser() {
    const { auth } = usePage().props;
    const user = auth.operador;
    const fallback = initials(user?.name);
    const papelLabel = user?.papel === 'admin' ? 'Administrador' : 'Operador';

    return (
        <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 sm:flex">
                <MedalhaoFlorim size="sm" className="size-7" />
                <span className="text-xs font-medium text-gold">Florim</span>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 gap-2 bg-card">
                        <Avatar className="size-6">
                            <AvatarFallback className="text-xs">{fallback}</AvatarFallback>
                        </Avatar>
                        <span className="hidden max-w-32 truncate sm:inline">{papelLabel}</span>
                        <ChevronsUpDownIcon className="size-3.5 opacity-60" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-56">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col gap-0.5">
                            <span className="font-medium">{user?.name}</span>
                            <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link
                            href="/admin/logout"
                            method="post"
                            as="button"
                            className="w-full cursor-pointer"
                        >
                            <LogOutIcon />
                            Sair
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
