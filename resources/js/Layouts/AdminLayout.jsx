import { Link } from '@inertiajs/react';
import { Fragment } from 'react';
import Flash from '@/Components/Flash';
import { AppSidebar } from '@/Components/admin/AppSidebar';
import { HeaderUser } from '@/Components/admin/HeaderUser';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb';
import { Separator } from '@/Components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/Components/ui/sidebar';
import { TooltipProvider } from '@/Components/ui/tooltip';

export default function AdminLayout({
    children,
    title,
    subtitle,
    hideTitle = false,
    breadcrumbs,
}) {
    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset className="bg-background">
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex w-full items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs ? (
                                        breadcrumbs.map((item, index) => (
                                            <Fragment key={item.label}>
                                                {index > 0 && <BreadcrumbSeparator />}
                                                <BreadcrumbItem>
                                                    {item.href ? (
                                                        <BreadcrumbLink asChild>
                                                            <Link href={item.href}>{item.label}</Link>
                                                        </BreadcrumbLink>
                                                    ) : (
                                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                                    )}
                                                </BreadcrumbItem>
                                            </Fragment>
                                        ))
                                    ) : (
                                        <>
                                            <BreadcrumbItem className="hidden md:block">
                                                <BreadcrumbLink asChild>
                                                    <Link href="/admin">Área Verde</Link>
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                            {title && (
                                                <>
                                                    <BreadcrumbSeparator className="hidden md:block" />
                                                    <BreadcrumbItem>
                                                        <BreadcrumbPage>{title}</BreadcrumbPage>
                                                    </BreadcrumbItem>
                                                </>
                                            )}
                                        </>
                                    )}
                                </BreadcrumbList>
                            </Breadcrumb>
                            <HeaderUser />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {!hideTitle && (title || subtitle) && (
                            <div className="space-y-1">
                                {title && (
                                    <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                                        {title}
                                    </h1>
                                )}
                                {subtitle && (
                                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                                )}
                            </div>
                        )}
                        <Flash />
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
