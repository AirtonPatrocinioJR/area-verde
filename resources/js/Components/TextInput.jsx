export default function TextInput({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    required = false,
    placeholder,
    step,
    min,
    className = '',
}) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
            <input
                type={type}
                name={name}
                value={value ?? ''}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                step={step}
                min={min}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/20 ${
                    error ? 'border-danger' : 'border-line'
                }`}
            />
            {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
        </label>
    );
}
