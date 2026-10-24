import { cn } from '@/lib/utils';

/**
 * Logo Flor Atlântica / Área Verde.
 * O arquivo é um JPEG lado a lado (creme | verde). Em fundo creme usa a metade
 * esquerda; na sidebar (verde) usa a metade direita.
 */
export function LogoAreaVerde({ variant = 'light', className, ...props }) {
    const isDark = variant === 'dark';

    return (
        <div
            className={cn('relative overflow-hidden', className)}
            role="img"
            aria-label="Flor Atlântica Área Verde"
            {...props}
        >
            <img
                src="/marca/logo-flor-atlantica.jpg"
                alt=""
                className={cn(
                    'absolute inset-y-0 h-full max-w-none',
                    isDark ? 'left-0 w-[200%] -translate-x-1/2' : 'left-0 w-[200%]',
                )}
                draggable={false}
            />
        </div>
    );
}

export function MedalhaoFlorim({ className, size = 'md' }) {
    const sizes = {
        sm: 'size-10',
        md: 'size-14',
        lg: 'size-20',
        xl: 'size-24',
    };

    return (
        <img
            src="/marca/moeda-florim.png"
            alt=""
            aria-hidden
            className={cn(
                'shrink-0 object-contain drop-shadow-md',
                sizes[size] ?? sizes.md,
                className,
            )}
            draggable={false}
        />
    );
}
