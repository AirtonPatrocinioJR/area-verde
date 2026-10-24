import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangleIcon, TerminalIcon } from 'lucide-react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/Components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/Components/ui/card';
import { Field, FieldError, FieldLabel } from '@/Components/ui/field';
import { Input } from '@/Components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
} from '@/Components/ui/input-group';

export default function Index({ prontos = [], bloqueados = [], resultado = null }) {
    const form = useForm({ comando: '' });
    const [pending, setPending] = useState(null);
    const [confirmText, setConfirmText] = useState('');
    const [runningReady, setRunningReady] = useState(false);

    const processing = form.processing || runningReady;

    function openConfirm(item) {
        setConfirmText('');
        setPending(item);
    }

    function closeConfirm() {
        setPending(null);
        setConfirmText('');
    }

    function runCommand(comando) {
        setRunningReady(true);
        form.clearErrors();
        router.post(
            '/admin/comandos',
            { comando },
            {
                preserveScroll: true,
                onFinish: () => {
                    setRunningReady(false);
                    closeConfirm();
                },
            },
        );
    }

    function submitConsole(e) {
        e.preventDefault();
        form.clearErrors();
        form.post('/admin/comandos', { preserveScroll: true });
    }

    const destrutivo = Boolean(pending?.destrutivo);
    const podeConfirmar = !destrutivo || confirmText.trim() === 'LIMPAR';

    return (
        <AdminLayout title="Comandos">
            <Head title="Comandos" />

            <div className="space-y-8">
                <Alert>
                    <AlertTriangleIcon />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>
                        Os comandos rodam no servidor com o usuário da aplicação. Use com cuidado —
                        ações destrutivas não podem ser desfeitas.
                    </AlertDescription>
                </Alert>

                <section className="space-y-4">
                    <div>
                        <h2 className="font-heading text-lg font-medium text-leaf-dark">
                            Comandos prontos
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Atalhos seguros para manutenção. Comandos destrutivos pedem confirmação
                            extra.
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {prontos.map((item) => (
                            <Card key={item.comando} size="sm" className="h-full">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle>{item.titulo}</CardTitle>
                                        {item.destrutivo ? (
                                            <Badge variant="destructive">Destrutivo</Badge>
                                        ) : null}
                                    </div>
                                    <CardDescription>{item.descricao}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <code className="block truncate rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                                        php artisan {item.comando}
                                    </code>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        type="button"
                                        variant={item.destrutivo ? 'destructive' : 'outline'}
                                        size="sm"
                                        disabled={processing}
                                        onClick={() => openConfirm(item)}
                                    >
                                        Executar
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div>
                        <h2 className="font-heading text-lg font-medium text-leaf-dark">Console</h2>
                        <p className="text-sm text-muted-foreground">
                            Digite qualquer comando artisan. Bloqueados: {bloqueados.join(', ')},
                            make:*
                        </p>
                    </div>
                    <Card>
                        <CardContent className="pt-(--card-spacing)">
                            <form onSubmit={submitConsole} className="space-y-3">
                                <Field data-invalid={Boolean(form.errors.comando) || undefined}>
                                    <FieldLabel htmlFor="comando-livre">Comando</FieldLabel>
                                    <InputGroup className="h-10">
                                        <InputGroupAddon>
                                            <InputGroupText className="font-mono text-xs">
                                                <TerminalIcon className="size-3.5" />
                                                php artisan
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <InputGroupInput
                                            id="comando-livre"
                                            name="comando"
                                            value={form.data.comando}
                                            onChange={(e) => form.setData('comando', e.target.value)}
                                            placeholder="cache:clear"
                                            className="font-mono"
                                            disabled={processing}
                                            aria-invalid={Boolean(form.errors.comando)}
                                            autoComplete="off"
                                            spellCheck={false}
                                        />
                                        <InputGroupAddon align="inline-end">
                                            <InputGroupButton type="submit" disabled={processing}>
                                                {processing ? 'Executando…' : 'Executar'}
                                            </InputGroupButton>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldError>{form.errors.comando}</FieldError>
                                </Field>
                            </form>
                        </CardContent>
                    </Card>
                </section>

                {resultado ? (
                    <section className="space-y-4">
                        <div>
                            <h2 className="font-heading text-lg font-medium text-leaf-dark">
                                Último resultado
                            </h2>
                        </div>
                        <Card>
                            <CardHeader className="border-b">
                                <div className="flex flex-wrap items-center gap-2">
                                    <CardTitle className="font-mono text-sm">
                                        php artisan {resultado.comando}
                                    </CardTitle>
                                    <Badge
                                        variant={
                                            resultado.exit_code === 0 ? 'default' : 'destructive'
                                        }
                                    >
                                        exit {resultado.exit_code}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        {resultado.duracao_ms} ms · {resultado.executado_em}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-(--card-spacing)">
                                <pre className="max-h-96 overflow-auto rounded-md bg-muted p-3 font-mono text-xs whitespace-pre-wrap">
                                    {resultado.saida}
                                </pre>
                            </CardContent>
                        </Card>
                    </section>
                ) : null}
            </div>

            <AlertDialog
                open={pending != null}
                onOpenChange={(open) => {
                    if (!open) closeConfirm();
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {destrutivo ? 'Confirmar limpeza?' : 'Executar comando?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {destrutivo
                                ? 'Esta ação apaga dados permanentemente. Digite LIMPAR para confirmar.'
                                : `Será executado: php artisan ${pending?.comando ?? ''}`}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    {destrutivo ? (
                        <Field>
                            <FieldLabel htmlFor="confirm-limpar">Confirmação</FieldLabel>
                            <Input
                                id="confirm-limpar"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="LIMPAR"
                                autoComplete="off"
                                className="font-mono"
                            />
                        </Field>
                    ) : null}
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            variant={destrutivo ? 'destructive' : 'default'}
                            disabled={processing || !podeConfirmar}
                            onClick={(e) => {
                                e.preventDefault();
                                if (pending && podeConfirmar) {
                                    runCommand(pending.comando);
                                }
                            }}
                        >
                            {processing ? 'Executando…' : 'Executar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
