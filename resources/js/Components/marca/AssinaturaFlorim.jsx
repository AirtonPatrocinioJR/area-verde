import { MedalhaoFlorim } from '@/Components/marca/LogoAreaVerde';
import { ASSINATURA_FLORIM } from '@/lib/format';
import { cn } from '@/lib/utils';

export function AssinaturaFlorim({ className }) {
    return (
        <div className={cn('flex flex-col items-center gap-2 text-center', className)}>
            <MedalhaoFlorim size="md" />
            <p className="text-xs font-medium uppercase tracking-wide text-gold">
                {ASSINATURA_FLORIM}
            </p>
        </div>
    );
}
