import { usePage } from '@inertiajs/react';
import {
    GiftIcon,
    LayoutDashboardIcon,
    RecycleIcon,
    UserCogIcon,
    UsersIcon,
} from 'lucide-react';
import { Brand } from '@/Components/admin/Brand';
import { NavMain } from '@/Components/admin/NavMain';
import { NavUser } from '@/Components/admin/NavUser';
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
        title: 'Recicláveis',
        url: '/admin/reciclaveis',
        icon: <RecycleIcon />,
        match: (path) => path.startsWith('/admin/reciclaveis'),
    },
    {
        title: 'Brindes',
        url: '/admin/brindes',
        icon: <GiftIcon />,
        match: (path) => path.startsWith('/admin/brindes'),
    },
    {
        title: 'Usuários',
        url: '/admin/usuarios',
        icon: <UserCogIcon />,
        match: (path) => path.startsWith('/admin/usuarios'),
        adminOnly: true,
    },
];

export function AppSidebar(props) {
    const { auth, url } = usePage().props;
    const path = typeof window !== 'undefined' ? window.location.pathname : (url || '');
    const isAdmin = auth.operador?.papel === 'admin';

    const items = nav
        .filter((item) => !item.adminOnly || isAdmin)
        .map((item) => ({
            title: item.title,
            url: item.url,
            icon: item.icon,
            isActive: item.match(path),
        }));

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Brand />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth.operador} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
