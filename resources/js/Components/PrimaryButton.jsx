export default function PrimaryButton({ children, type = 'submit', disabled = false, className = '', ...props }) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`inline-flex items-center justify-center rounded-lg bg-leaf px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-leaf-dark disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
