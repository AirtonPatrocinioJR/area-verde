export function formatSemente(valor) {
    const n = Number(valor ?? 0);
    return `${n.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} Semente`;
}

export function formatTelefone(telefone) {
    const d = String(telefone ?? '').replace(/\D/g, '');
    if (d.length === 11) {
        return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }
    if (d.length === 10) {
        return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    }
    return telefone;
}
