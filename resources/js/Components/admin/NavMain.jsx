import { Link } from '@inertiajs/react';
import { ChevronRightIcon } from 'lucide-react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/Components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/Components/ui/sidebar';
import { cn } from '@/lib/utils';

export function NavMain({ items }) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/60">Menu</SidebarGroupLabel>
            <SidebarMenu className="gap-1">
                {items.map((item) =>
                    item.items?.length ? (
                        <NavGroup key={item.title} item={item} />
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={item.title}
                                isActive={item.isActive}
                                className={cn(
                                    item.isActive &&
                                        'border-l-2 border-l-gold data-active:bg-sidebar-accent',
                                )}
                            >
                                <Link href={item.url}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function NavGroup({ item }) {
    const childActive = item.items.some((child) => child.isActive);

    return (
        <Collapsible asChild defaultOpen={childActive} className="group/collapsible">
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        tooltip={item.title}
                        isActive={childActive}
                        className={cn(
                            childActive &&
                                'border-l-2 border-l-gold data-active:bg-sidebar-accent',
                        )}
                    >
                        {item.icon}
                        <span>{item.title}</span>
                        <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.items.map((child) => (
                            <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton
                                    asChild
                                    isActive={child.isActive}
                                    className={cn(
                                        child.isActive &&
                                            'border-l-2 border-l-gold data-active:bg-sidebar-accent',
                                    )}
                                >
                                    <Link href={child.url}>
                                        {child.icon}
                                        <span>{child.title}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}
