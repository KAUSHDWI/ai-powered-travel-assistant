import React from 'react';
import { Check, Edit3 } from 'lucide-react';
import { cn } from '../../utils/cn.js';

interface FieldRowProps {
  label: string;
  value: string | number | undefined;
}

export const FieldRow: React.FC<FieldRowProps> = ({ label, value }) => {
  const isProvided = value !== undefined && value !== null && value !== '' && value !== 0;

  return (
    <div
      className={cn(
        'flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 text-xs transition-colors',
        isProvided ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'
      )}
    >
      <div className="flex items-center space-x-2">
        <div
          className={cn(
            'flex h-4.5 w-4.5 items-center justify-center rounded-full border shrink-0',
            isProvided
              ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900 text-blue-600 dark:text-blue-400'
              : 'border-slate-200 dark:border-slate-800'
          )}
        >
          {isProvided ? <Check className="h-3 w-3" /> : <div className="h-1 w-1 bg-slate-300 rounded-full" />}
        </div>
        <span className="font-medium text-slate-500 dark:text-slate-400">{label}</span>
      </div>

      <div className="font-semibold text-right max-w-[60%] truncate">
        {isProvided ? (
          <span className="animate-in fade-in duration-300 font-display">{value}</span>
        ) : (
          <span className="italic font-light">Not provided</span>
        )}
      </div>
    </div>
  );
};
export default FieldRow;
