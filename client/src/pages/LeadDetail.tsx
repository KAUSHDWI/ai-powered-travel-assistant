import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLead } from '../hooks/useLead.js';
import ConversationTranscript from '../components/admin/ConversationTranscript.js';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card.js';
import { Badge } from '../components/ui/badge.js';
import { Button } from '../components/ui/button.js';
import { Separator } from '../components/ui/separator.js';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';
import { CONFIDENCE_COLORS } from '../utils/constants.js';
import { formatDate } from '../utils/formatters.js';

export const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentLead, loading, error, fetchLeadById } = useLead();
  const [transcript, setTranscript] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchLeadById(id);
    }
  }, [id, fetchLeadById]);

  // Fetch full messages logs for transcript
  useEffect(() => {
    const getTranscript = async () => {
      if (currentLead?.conversationId) {
        try {
          const leadService = await import('../services/lead.service.js');
          const response = await leadService.getConversationTranscript(currentLead.conversationId);
          if (response.success && response.data) {
            setTranscript(response.data.messages || []);
          }
        } catch {
          // Log or handle gracefully
        }
      }
    };
    getTranscript();
  }, [currentLead]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[calc(100vh-10rem)]">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-muted-foreground mt-3 font-semibold">Loading lead transcript...</span>
      </div>
    );
  }

  if (error || !currentLead) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-4">
        <div className="text-3xl">⚠️</div>
        <h3 className="text-lg font-semibold text-slate-800">Failed to Load Lead Details</h3>
        <p className="text-sm text-muted-foreground">{error || 'Lead records could not be retrieved'}</p>
        <Button onClick={() => navigate('/admin')} className="rounded-xl cursor-pointer">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const confidenceConfig = CONFIDENCE_COLORS[currentLead.qualification.confidence] || CONFIDENCE_COLORS['Low'];

  return (
    <div className="flex-1 space-y-6 animate-in fade-in duration-200">
      {/* Return to Dashboard header bar */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/admin')}
          className="h-9.5 w-9.5 rounded-xl cursor-pointer border-slate-200 shadow-sm"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 font-display">
            Lead Details
          </h2>
          <p className="text-xs text-muted-foreground">
            Captured on {formatDate(currentLead.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Profile card & metrics overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 dark:bg-slate-900/30 p-5 border-b border-border flex flex-col gap-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Profile Target
                </span>
                <Badge className={`${confidenceConfig.badge} border-none shadow-none`}>
                  {currentLead.qualification.confidence} confidence
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-display">
                {currentLead.customer.name || <span className="italic font-light text-slate-400">Anonymous Traveler</span>}
              </h3>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Contact parameters */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Contact Details
                </span>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{currentLead.customer.phone || <span className="italic text-slate-400">No phone provided</span>}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{currentLead.customer.email || <span className="italic text-slate-400">No email provided</span>}</span>
                </div>
              </div>

              <Separator />

              {/* Qualification details */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lead Score Breakdown
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-display">
                    {currentLead.qualification.leadScore}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">/100 points</span>
                </div>
                <div className="space-y-1.5 pl-1.5">
                  {currentLead.qualification.reason.map((reason, idx) => (
                    <div key={idx} className="flex items-start text-[11px] text-slate-500 leading-relaxed">
                      <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live conversation trip profile summary */}
          <Card className="border border-border shadow-sm">
            <CardContent className="p-5 space-y-3.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>AI Profile Summary</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border">
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  {currentLead.qualification.summary || 'Summary profile processing...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Full travel itinerary details & conversation transcript */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-border shadow-sm">
            <CardHeader className="p-5 border-b border-border">
              <CardTitle className="text-md">Travel Parameters captured</CardTitle>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3 text-xs">
                <MapPin className="h-4.5 w-4.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Destination
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentLead.travel.destination || <span className="italic text-slate-400">TBD</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <MapPin className="h-4.5 w-4.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Departure City
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentLead.travel.departureCity || <span className="italic text-slate-400">Not provided</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <Calendar className="h-4.5 w-4.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Travel Date
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentLead.travel.travelDate || <span className="italic text-slate-400">Not provided</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <Clock className="h-4.5 w-4.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Duration
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentLead.travel.duration || <span className="italic text-slate-400">Not provided</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <User className="h-4.5 w-4.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Travellers
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentLead.travel.travellers ? `${currentLead.travel.travellers} traveler(s)` : <span className="italic text-slate-400">Not set</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mt-1.5 mr-2 shrink-0">💰</span>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Budget limits
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentLead.travel.budget || <span className="italic text-slate-400">Not provided</span>}
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-xs sm:col-span-2">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mt-1.5 mr-2 shrink-0">📝</span>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5 uppercase tracking-wider text-[10px]">
                    Special Requirements
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {currentLead.travel.specialRequirements || <span className="italic text-slate-400">None specified</span>}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat transcript timeline */}
          <ConversationTranscript messages={transcript} />
        </div>
      </div>
    </div>
  );
};
export default LeadDetail;
