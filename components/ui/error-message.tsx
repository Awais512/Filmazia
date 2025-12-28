'use client';

import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ title = 'Something went wrong', message = 'An unexpected error occurred.', onRetry, className }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-medium text-white mb-2">{title}</h2>
      <p className="text-gray-400 mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </motion.div>
  );
}
