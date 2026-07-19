import React from 'react';
import { Card, CardContent } from '../ui/card.js';
import { Users, ClipboardList, ShieldAlert, Award } from 'lucide-react';
import type { Lead } from '../../types/index.js';

interface AnalyticsCardsProps {
  leads: Lead[];
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ leads }) => {
  const totalLeads = leads.length;

  const averageScore =
    totalLeads > 0
      ? Math.round(
          leads.reduce((sum, lead) => sum + lead.qualification.leadScore, 0) / totalLeads
        )
      : 0;

  const highConfidenceCount = leads.filter(
    (lead) => lead.qualification.confidence === 'High'
  ).length;

  const mediumConfidenceCount = leads.filter(
    (lead) => lead.qualification.confidence === 'Medium'
  ).length;

  const lowConfidenceCount = leads.filter(
    (lead) => lead.qualification.confidence === 'Low'
  ).length;

  const cardConfig = [
    {
      title: 'Total Inquiries',
      value: totalLeads,
      description: 'Captured opportunities',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Average Lead Score',
      value: `${averageScore}/100`,
      description: 'Engagement health rating',
      icon: Award,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      title: 'High Confidence Leads',
      value: highConfidenceCount,
      description: 'Ready-to-book opportunities',
      icon: ClipboardList,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20'
    },
    {
      title: 'Medium & Low Leads',
      value: `${mediumConfidenceCount} / ${lowConfidenceCount}`,
      description: 'Nurture candidates',
      icon: ShieldAlert,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
      {cardConfig.map((card, idx) => (
        <Card key={idx} className="border border-border shadow-sm overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-display">
                {card.title}
              </span>
              <p className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">
                {card.value}
              </p>
              <span className="text-[10px] text-slate-500 block">
                {card.description}
              </span>
            </div>
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${card.bg}`}>
              <card.icon className={`h-5.5 w-5.5 ${card.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default AnalyticsCards;
