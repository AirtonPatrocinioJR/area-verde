import { cn } from '@/lib/utils';

/**
 * Faixa institucional de logos do Flor Atlântica (créditos no rodapé).
 */
export function BarraLogos({ className, ...props }) {
    return (
        <footer
            className={cn('mt-auto w-full shrink-0 bg-background py-3', className)}
            {...props}
        >
            <img
                src="/marca/barra-logos-flor-atlantica.png"
                alt="Secretaria de Cultura e Economia Criativa, Governo do Estado do Rio de Janeiro, Sistema Nacional de Cultura, Aldir Blanc e Governo Federal"
                className="mx-auto h-auto max-h-14 w-full object-contain object-center sm:max-h-16"
                draggable={false}
            />
        </footer>
    );
}
