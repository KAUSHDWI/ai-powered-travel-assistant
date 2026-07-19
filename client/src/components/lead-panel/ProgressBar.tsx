import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1 text-xs">
        <span className="text-muted-foreground font-medium">Completion Progress</span>
        <span className="font-semibold text-primary font-display">{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/20 shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
        />
      </div>
    </div>
  );
};
export default ProgressBar;
