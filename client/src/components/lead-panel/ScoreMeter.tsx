import React from 'react';
import { motion } from 'framer-motion';
import { CONFIDENCE_COLORS } from '../../utils/constants.js';

interface ScoreMeterProps {
  score: number;
  confidence: 'Low' | 'Medium' | 'High';
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({ score, confidence }) => {
  const config = CONFIDENCE_COLORS[confidence] || CONFIDENCE_COLORS['Low'];

  // Map to a gradient ring or color
  const getColorClass = () => {
    switch (confidence) {
      case 'High':
        return 'text-emerald-500';
      case 'Medium':
        return 'text-amber-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {/* Circular Gauge */}
      <div className="relative h-24 w-24">
        <svg className="h-full w-full" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            className="text-slate-100 dark:text-slate-800"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Animated score circle */}
          <motion.path
            initial={{ strokeDasharray: '0, 100' }}
            animate={{ strokeDasharray: `${score}, 100` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={getColorClass()}
            strokeWidth="3.5"
            strokeDasharray={`${score}, 100`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-display tracking-tight text-slate-800 dark:text-slate-100">
            {score}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
            Score
          </span>
        </div>
      </div>
    </div>
  );
};
export default ScoreMeter;
