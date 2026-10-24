import { MinusIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { ButtonGroup, ButtonGroupText } from '@/Components/ui/button-group';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';

function toNumber(value) {
    if (value === '' || value == null) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
}

function clamp(n, min, max) {
    let v = n;
    if (min != null && v < min) v = min;
    if (max != null && v > max) v = max;
    return v;
}

export function CampoNumero({
    value,
    onChange,
    min,
    max,
    step = 1,
    prefix,
    id,
    name,
    required,
    disabled,
    'aria-invalid': ariaInvalid,
    className,
    placeholder,
}) {
    const numeric = toNumber(value);
    const stepNum = Number(step) || 1;
    const minNum = min != null ? Number(min) : null;
    const maxNum = max != null ? Number(max) : null;
    const canDec =
        !disabled && (numeric == null || minNum == null || numeric > minNum);
    const canInc =
        !disabled && (numeric == null || maxNum == null || numeric < maxNum);

    function emit(next) {
        onChange?.(next);
    }

    function bump(delta) {
        const base = numeric ?? (min != null ? Number(min) : 0);
        const next = clamp(base + delta, min != null ? Number(min) : null, max != null ? Number(max) : null);
        // Inteiros sem casas; decimais com precisão razoável
        const rounded =
            Number.isInteger(stepNum) && Number.isInteger(next)
                ? next
                : Math.round(next * 100) / 100;
        emit(rounded);
    }

    function onInputChange(e) {
        const raw = e.target.value;
        if (raw === '') {
            emit('');
            return;
        }
        // Permite digitar decimais (ex.: 3.5) sem forçar clamp a cada tecla
        if (!/^\d*\.?\d*$/.test(raw)) return;
        emit(raw);
    }

    function onBlur() {
        if (value === '' || value == null) {
            if (min != null) emit(Number(min));
            return;
        }
        const n = toNumber(value);
        if (n == null) {
            if (min != null) emit(Number(min));
            return;
        }
        emit(clamp(n, min != null ? Number(min) : null, max != null ? Number(max) : null));
    }

    return (
        <ButtonGroup className={cn('w-full', className)}>
            {prefix != null && (
                <ButtonGroupText className="px-2">{prefix}</ButtonGroupText>
            )}
            <Input
                id={id}
                name={name}
                type="number"
                inputMode="decimal"
                min={min}
                max={max}
                step={step}
                value={value ?? ''}
                onChange={onInputChange}
                onBlur={onBlur}
                required={required}
                disabled={disabled}
                placeholder={placeholder}
                aria-invalid={ariaInvalid}
                className={cn(
                    'min-w-0 text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                )}
            />
            <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!canDec}
                onClick={() => bump(-stepNum)}
                aria-label="Diminuir"
            >
                <MinusIcon />
            </Button>
            <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!canInc}
                onClick={() => bump(stepNum)}
                aria-label="Aumentar"
            >
                <PlusIcon />
            </Button>
        </ButtonGroup>
    );
}
