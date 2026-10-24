import { usePage } from '@inertiajs/react';
import {
    ClipboardListIcon,
    LayoutDashboardIcon,
    LeafIcon,
    PackageIcon,
    RecycleIcon,
    SettingsIcon,
    ShoppingBagIcon,
    TerminalIcon,
    UserCogIcon,
    UsersIcon,
    WarehouseIcon,
} from 'lucide-react';
import { Brand } from '@/Components/admin/Brand';
import { NavMain } from '@/Components/admin/NavMain';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/Components/ui/sidebar';

const nav = [
    {
        title: 'Painel',
        url: '/admin',
        icon: <LayoutDashboardIcon />,
        match: (path) => path === '/admin',
    },
    {
        title: 'Clientes',
        url: '/admin/clientes',
        icon: <UsersIcon />,
        match: (path) => path.startsWith('/admin/clientes'),
    },
    {
        title: 'Receber',
        url: '/admin/receber',
        icon: <RecycleIcon />,
        match: (path) => path.startsWith('/admin/receber'),
    },
    {
        title: 'Vendas',
        url: '/admin/vender',
        icon: <ShoppingBagIcon />,
        match: (path) => path.startsWith('/admin/vender'),
    },
    {
        title: 'Relatórios',
        url: '/admin/relatorios',
        icon: <ClipboardListIcon />,
        match: (path) => path.startsWith('/admin/relatorios'),
    },
    {
        title: 'Configurações',
        icon: <SettingsIcon />,
        match: (path) =>
            path.startsWith('/admin/usuarios') ||
            path.startsWith('/admin/produtos') ||
            path.startsWith('/admin/reciclaveis') ||
            path.startsWith('/admin/estoque') ||
            path.startsWith('/admin/comandos'),
        items: [
            {
                title: 'Usuários',
                url: '/admin/usuarios',
                icon: <UserCogIcon />,
                match: (path) => path.startsWith('/admin/usuarios'),
                adminOnly: true,
            },
            {
                title: 'Produtos',
                url: '/admin/produtos',
                icon: <PackageIcon />,
                match: (path) => path.startsWith('/admin/produtos'),
            },
            {
                title: 'Recicláveis',
                url: '/admin/reciclaveis',
                icon: <LeafIcon />,
                match: (path) => path.startsWith('/admin/reciclaveis'),
            },
            {
                title: 'Estoque',
                url: '/admin/estoque',
                icon: <WarehouseIcon />,
                match: (path) => path.startsWith('/admin/estoque'),
            },
            {
                title: 'Comandos',
                url: '/admin/comandos',
                icon: <TerminalIcon />,
                match: (path) => path.startsWith('/admin/comandos'),
                adminOnly: true,
            },
        ],
    },
];

function mapItem(item, path, isAdmin) {
    if (item.items) {
        const children = item.items
            .filter((child) => !child.adminOnly || isAdmin)
            .map((child) => ({
                title: child.title,
                url: child.url,
                icon: child.icon,
                isActive: child.match(path),
            }));

        if (children.length === 0) {
            return null;
        }

        return {
            title: item.title,
            icon: item.icon,
            items: children,
            isActive: item.match(path),
        };
    }

    if (item.adminOnly && !isAdmin) {
        return null;
    }

    return {
        title: item.title,
        url: item.url,
        icon: item.icon,
        isActive: item.match(path),
    };
}

export function AppSidebar(props) {
    const { auth, url } = usePage().props;
    const path = typeof window !== 'undefined' ? window.location.pathname : (url || '');
    const isAdmin = auth.operador?.papel === 'admin';

    const items = nav.map((item) => mapItem(item, path, isAdmin)).filter(Boolean);

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Brand />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>
            <SidebarFooter>
                <p className="px-2 pb-2 text-[10px] uppercase tracking-wider text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
                    Área Verde
                    <br />
                    Flor Atlântica
                </p>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
