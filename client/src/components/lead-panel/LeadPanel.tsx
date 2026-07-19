import React from 'react';
import { User, ClipboardList, TrendingUp } from 'lucide-react';
import useChat from '../../hooks/useChat.js';
import useConversation from '../../hooks/useConversation.js';
import ProgressBar from './ProgressBar.js';
import ConfidenceBadge from './ConfidenceBadge.js';
import ScoreMeter from './ScoreMeter.js';
import FieldRow from './FieldRow.js';
import MissingFields from './MissingFields.js';
import ConversationSummary from './ConversationSummary.js';
import { Separator } from '../ui/separator.js';
import { FIELD_LABELS } from '../../utils/constants.js';

export const LeadPanel: React.FC = () => {
  const { state } = useChat();
  const { missingFields, completionPercentage } = useConversation();
  const memory = state.memory;

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-md overflow-y-auto p-5 space-y-5">
      {/* Panel title / status section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Trip Profile</h3>
        </div>
        {state.leadScore.score > 0 && (
          <ConfidenceBadge confidence={state.leadScore.confidence} />
        )}
      </div>

      {/* Completion Meter */}
      <ProgressBar percentage={completionPercentage} />

      <Separator />

      {/* Score Meter & Lead Metrics */}
      {state.leadScore.score > 0 ? (
        <div className="flex items-center justify-around bg-slate-50/50 dark:bg-slate-900/30 p-3 rounded-2xl border border-border">
          <ScoreMeter score={state.leadScore.score} confidence={state.leadScore.confidence} />
          <div className="text-left space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Buying Intent
            </span>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 block font-display">
              {state.intent.level} Intent
            </span>
            <span className="text-[11px] text-slate-500 leading-normal line-clamp-2 max-w-[140px] block">
              {state.intent.reason}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-border rounded-2xl bg-slate-50/30 dark:bg-slate-950/5">
          <TrendingUp className="h-7 w-7 text-slate-300 dark:text-slate-700 mb-2" />
          <p className="text-xs text-muted-foreground font-medium">
            Maya will calculate intent and qualification parameters as you share trip details.
          </p>
        </div>
      )}

      {/* Captured Fields */}
      <div className="space-y-1">
        <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          <User className="h-3.5 w-3.5" />
          <span>Client & Travel Details</span>
        </div>
        <FieldRow label={FIELD_LABELS.destination} value={memory.destination} />
        <FieldRow label={FIELD_LABELS.travelDate} value={memory.travelDate} />
        <FieldRow label={FIELD_LABELS.travellers} value={memory.travellers} />
        <FieldRow label={FIELD_LABELS.budget} value={memory.budget} />
        <FieldRow label={FIELD_LABELS.tripType} value={memory.tripType} />
        <FieldRow label={FIELD_LABELS.duration} value={memory.duration} />
        <FieldRow label={FIELD_LABELS.departureCity} value={memory.departureCity} />
        <FieldRow label={FIELD_LABELS.specialRequirements} value={memory.specialRequirements} />
        <FieldRow label={FIELD_LABELS.name} value={memory.name} />
        <FieldRow label={FIELD_LABELS.phone} value={memory.phone} />
        <FieldRow label={FIELD_LABELS.email} value={memory.email} />
      </div>

      <Separator />

      {/* Missing Fields list */}
      <MissingFields fields={missingFields as any} />

      <Separator />

      {/* Live text summary */}
      <ConversationSummary summary={state.summary} />
    </div>
  );
};
export default LeadPanel;
