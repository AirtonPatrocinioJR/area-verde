export default function TextArea({ label, name, value, onChange, error, rows = 3 }) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
            <textarea
                name={name}
                value={value ?? ''}
                onChange={onChange}
                rows={rows}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/20 ${
                    error ? 'border-danger' : 'border-line'
                }`}
            />
            {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
        </label>
    );
}
