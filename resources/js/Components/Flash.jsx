import { usePage } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { CheckCircle2Icon, CircleAlertIcon } from 'lucide-react';

export default function Flash() {
    const { flash, errors } = usePage().props;
    const errorList = errors ? Object.values(errors).flat() : [];

    return (
        <div className="mb-4 space-y-2">
            {flash?.success && (
                <Alert className="border-primary/30 bg-primary/10 text-primary">
                    <CheckCircle2Icon />
                    <AlertTitle>Sucesso</AlertTitle>
                    <AlertDescription className="text-primary">{flash.success}</AlertDescription>
                </Alert>
            )}
            {flash?.error && (
                <Alert variant="destructive">
                    <CircleAlertIcon />
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{flash.error}</AlertDescription>
                </Alert>
            )}
            {errorList.length > 0 && (
                <Alert variant="destructive">
                    <CircleAlertIcon />
                    <AlertTitle>Verifique os campos</AlertTitle>
                    <AlertDescription>
                        <ul className="list-inside list-disc space-y-1">
                            {errorList.map((msg, i) => (
                                <li key={i}>{msg}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
}
