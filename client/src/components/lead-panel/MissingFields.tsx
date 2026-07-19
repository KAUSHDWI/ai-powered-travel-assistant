import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FIELD_LABELS } from '../../utils/constants.js';

interface MissingFieldsProps {
  fields: Array<keyof typeof FIELD_LABELS>;
}

export const MissingFields: React.FC<MissingFieldsProps> = ({ fields }) => {
  if (fields.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-xs text-emerald-800 dark:text-emerald-400 font-medium">
        <span>✨ All key travel details have been collected!</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1.5 text-xs text-amber-700 dark:text-amber-500 font-semibold mb-1">
        <AlertCircle className="h-3.5 w-3.5" />
        <span>Missing Information Checklist ({fields.length})</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border">
        {fields.map((field) => (
          <div key={field} className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="h-1.5 w-1.5 bg-slate-300 dark:bg-slate-600 rounded-full" />
            <span>{FIELD_LABELS[field]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MissingFields;
