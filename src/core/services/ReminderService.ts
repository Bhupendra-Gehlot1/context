import { questionRepository } from "../repositories/QuestionRepository";
import type { Question } from "../models";
import type { RealtimeChannel } from "@supabase/supabase-js";

export class ReminderService {
  async loadOpenQuestions(): Promise<Question[]> {
    return questionRepository.fetchOpenQuestions();
  }

  subscribeToChanges(onChange: () => void): RealtimeChannel {
    return questionRepository.subscribeToQuestions(onChange);
  }

  unsubscribe(channel: RealtimeChannel): void {
    questionRepository.unsubscribe(channel);
  }
}

export const reminderService = new ReminderService();
