import { useMemo } from 'react';
import useChat from './useChat.js';

export function useConversation() {
  const { state } = useChat();

  const missingFields = useMemo(() => {
    const memory = state.memory as Record<string, any>;
    const required: Array<keyof typeof memory> = [
      'destination',
      'travelDate',
      'travellers',
      'budget',
      'tripType',
      'duration',
      'departureCity',
      'specialRequirements',
      'name',
      'phone',
    ];

    return required.filter((field) => {
      const value = memory[field];
      return value === undefined || value === null || value === '' || value === 0;
    });
  }, [state.memory]);

  const completionPercentage = useMemo(() => {
    const totalFields = 10;
    const missingCount = missingFields.length;
    const completedCount = totalFields - missingCount;
    return Math.round((completedCount / totalFields) * 100);
  }, [missingFields]);

  return {
    missingFields,
    completionPercentage,
    hasMissingFields: missingFields.length > 0,
  };
}
export default useConversation;
