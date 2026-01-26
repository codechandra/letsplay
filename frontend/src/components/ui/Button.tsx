import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        const variants = {
            primary: 'bg-letsplay-blue text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md',
            secondary: 'bg-letsplay-yellow text-slate-900 hover:bg-yellow-400 active:bg-yellow-500 shadow-sm hover:shadow-md',
            outline: 'border-2 border-slate-200 bg-transparent text-slate-700 hover:border-letsplay-blue hover:text-letsplay-blue',
            ghost: 'bg-transparent text-slate-600 hover:text-letsplay-blue hover:bg-blue-50',
        };

        const sizes = {
            sm: 'h-9 px-4 text-xs font-bold uppercase tracking-wider rounded-md',
            md: 'h-11 px-6 text-sm font-bold uppercase tracking-wider rounded-lg',
            lg: 'h-14 px-8 text-base font-bold uppercase tracking-wider rounded-xl',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none',
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
