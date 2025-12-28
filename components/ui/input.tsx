'use client';

import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: 'search' | 'none';
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon = 'none', onClear, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-300">{label}</label>
        )}
        <div className="relative">
          {icon === 'search' && (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          )}
          <input
            ref={ref}
            className={cn(
              'w-full bg-cinematic-gray border border-cinematic-light rounded-lg px-4 py-2 text-white placeholder-gray-500 transition-colors',
              'focus:outline-none focus:border-accent-amber focus:ring-1 focus:ring-accent-amber',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              icon === 'search' && 'pl-10',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {props.value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
