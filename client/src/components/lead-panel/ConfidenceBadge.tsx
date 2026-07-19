import React from 'react';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { CONFIDENCE_COLORS } from '../../utils/constants.js';

interface ConfidenceBadgeProps {
  confidence: 'Low' | 'Medium' | 'High';
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  const config = CONFIDENCE_COLORS[confidence] || CONFIDENCE_COLORS['Low'];

  const getIcon = () => {
    switch (confidence) {
      case 'High':
        return <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />;
      case 'Medium':
        return <Shield className="h-3.5 w-3.5 mr-1 text-amber-600 dark:text-amber-400" />;
      default:
        return <ShieldAlert className="h-3.5 w-3.5 mr-1 text-red-600 dark:text-red-400" />;
    }
  };

  return (
    <div
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.border} ${config.bg} ${config.text} shadow-sm transition-colors`}
    >
      {getIcon()}
      {confidence} Confidence
    </div>
  );
};
export default ConfidenceBadge;
