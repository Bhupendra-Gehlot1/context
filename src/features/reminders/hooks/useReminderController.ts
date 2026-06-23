import { useEffect, useState, useCallback } from 'react';
import { reminderService } from '../../../core/services/ReminderService';
import type { Question } from '../../../core/models';

export function useReminderController() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await reminderService.loadOpenQuestions();
      setQuestions(data);
      setError(null);
    } catch {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const channel = reminderService.subscribeToChanges(load);
    return () => {
      reminderService.unsubscribe(channel);
    };
  }, [load]);

  return { questions, loading, error };
}
