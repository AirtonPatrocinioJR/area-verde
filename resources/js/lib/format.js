export function nomeSemente(valor) {
    const n = Math.abs(Number(valor ?? 0));
    return n === 1 ? 'Semente' : 'Sementes';
}

export function formatSemente(valor) {
    const n = Number(valor ?? 0);
    const inteiro = Number.isInteger(n);
    return `${n.toLocaleString('pt-BR', {
        minimumFractionDigits: inteiro ? 0 : 2,
        maximumFractionDigits: 2,
    })} ${nomeSemente(n)}`;
}

export function formatValorSemente(valor) {
    const n = Number(valor ?? 0);
    const inteiro = Number.isInteger(n);
    return n.toLocaleString('pt-BR', {
        minimumFractionDigits: inteiro ? 0 : 2,
        maximumFractionDigits: 2,
    });
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
