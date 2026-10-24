import { useEffect, useState } from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/Components/ui/avatar';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { formatTelefone } from '@/lib/format';

function initials(name) {
    if (!name) return '?';
    return name
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
}

export function BuscaCliente({ cliente, onSelect, onClear }) {
    const [q, setQ] = useState('');
    const [resultados, setResultados] = useState([]);
    const [buscando, setBuscando] = useState(false);

    useEffect(() => {
        if (q.trim().length < 2) {
            setResultados([]);
            return undefined;
        }

        const timer = setTimeout(async () => {
            setBuscando(true);
            try {
                const res = await fetch(`/admin/clientes-busca?q=${encodeURIComponent(q.trim())}`, {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                });
                const json = await res.json();
                setResultados(json.data ?? []);
            } catch {
                setResultados([]);
            } finally {
                setBuscando(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [q]);

    return (
        <div className="relative space-y-3">
            <div className="relative">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar cliente por nome ou WhatsApp"
                    className="bg-card pl-9"
                />
            </div>

            {!cliente && (resultados.length > 0 || buscando) && (
                <ul className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-md">
                    {buscando && resultados.length === 0 && (
                        <li className="px-3 py-2 text-sm text-muted-foreground">Buscando…</li>
                    )}
                    {resultados.map((c) => (
                        <li key={c.id}>
                            <button
                                type="button"
                                className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-muted"
                                onClick={() => {
                                    onSelect(c);
                                    setQ('');
                                    setResultados([]);
                                }}
                            >
                                <span className="font-medium">{c.nome}</span>
                                <span className="text-xs text-muted-foreground">
                                    {formatTelefone(c.telefone)}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {cliente && (
                <div className="flex items-center gap-3 rounded-xl bg-primary/10 px-3 py-2.5">
                    <Avatar size="sm">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                            {initials(cliente.nome)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-foreground">{cliente.nome}</p>
                        <p className="text-sm text-muted-foreground">
                            WhatsApp: {formatTelefone(cliente.telefone)}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 text-muted-foreground hover:text-foreground"
                        onClick={onClear}
                    >
                        <XIcon />
                    </Button>
                </div>
            )}
        </div>
    );
}
