import { Link } from '@inertiajs/react';
import { LogoAreaVerde } from '@/Components/marca/LogoAreaVerde';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/Components/ui/sidebar';

export function Brand() {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                    <Link href="/admin" className="gap-0!">
                        <LogoAreaVerde
                            variant="dark"
                            className="h-12 w-12 shrink-0 rounded-full"
                        />
                        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                            <span className="truncate font-medium text-sidebar-foreground">
                                Área Verde
                            </span>
                            <span className="truncate text-xs text-sidebar-foreground/70">
                                Flor Atlântica
                            </span>
                        </div>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
