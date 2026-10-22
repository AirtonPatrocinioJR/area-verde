import { Link } from '@inertiajs/react';

export default function SecondaryButton({ children, href, className = '', ...props }) {
    const classes = `inline-flex items-center justify-center rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:border-leaf hover:text-leaf ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes} {...props}>
                {children}
            </Link>
        );
    }

    return (
        <button type="button" className={classes} {...props}>
            {children}
        </button>
    );
}
