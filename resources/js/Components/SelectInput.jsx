export default function SelectInput({ label, name, value, onChange, error, children, required = false }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
            <select
                name={name}
                value={value ?? ''}
                onChange={onChange}
                required={required}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/20 ${
                    error ? 'border-danger' : 'border-line'
                }`}
            >
                {children}
            </select>
            {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
        </label>
    );
}
