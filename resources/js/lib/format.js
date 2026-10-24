export function nomeFlorim(valor) {
    const n = Math.abs(Number(valor ?? 0));
    return n === 1 ? 'Florim' : 'Florins';
}

/** @deprecated Use nomeFlorim */
export function nomeSemente(valor) {
    return nomeFlorim(valor);
}

export function formatFlorim(valor) {
    const n = Number(valor ?? 0);
    return `${n.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })} ${nomeFlorim(n)}`;
}

/** @deprecated Use formatFlorim */
export function formatSemente(valor) {
    return formatFlorim(valor);
}

export function formatValorFlorim(valor) {
    const n = Number(valor ?? 0);
    return n.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/** @deprecated Use formatValorFlorim */
export function formatValorSemente(valor) {
    return formatValorFlorim(valor);
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

export const ASSINATURA_FLORIM = 'Florim · A moeda digital do Flor Atlântica';
