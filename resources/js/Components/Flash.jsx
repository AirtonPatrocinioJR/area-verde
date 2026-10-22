import { usePage } from '@inertiajs/react';

export default function Flash() {
    const { flash, errors } = usePage().props;
    const errorList = errors ? Object.values(errors).flat() : [];

    return (
        <div className="mb-4 space-y-2">
            {flash?.success && (
                <div className="rounded-lg border border-leaf/30 bg-leaf/10 px-4 py-3 text-sm text-leaf-dark">
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                    {flash.error}
                </div>
            )}
            {errorList.length > 0 && (
                <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                    <ul className="list-inside list-disc space-y-1">
                        {errorList.map((msg, i) => (
                            <li key={i}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
