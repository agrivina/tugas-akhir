import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes, ReactNode } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean;
    icon?: ReactNode; // Tambahan prop untuk ikon
}

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, icon, ...props }: Props,
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative flex items-center w-full">
            {/* Render ikon jika tersedia */}
            {icon && (
                <div className="absolute left-4 text-gray-500">
                    {icon}
                </div>
            )}
            <input
                {...props}
                type={type}
                className={
                    'w-full bg-slate-100 border-none focus:ring-2 focus:ring-polman-primary rounded-xl py-3 text-sm transition-all ' +
                    (icon ? 'pl-12 ' : 'pl-4 ') + // Beri padding kiri jika ada ikon
                    className
                }
                ref={localRef}
            />
        </div>
    );
});