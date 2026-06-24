import { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    disabled?: boolean;
}

export default function PrimaryButton({ className = '', disabled, children, ...props }: Props) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-polman-primary px-4 py-4 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-polman-secondary focus:outline-none focus:ring-2 focus:ring-polman-primary focus:ring-offset-2 active:bg-polman-secondary disabled:opacity-25 ` +
                className
            }
        >
            {children}
        </button>
    );
}