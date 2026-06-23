import { chatRepository } from '../repositories/ChatRepository';
import { questionRepository } from '../repositories/QuestionRepository';
import { detectQuestion } from '../utils';
import type { Message } from '../models';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class ChatService {
  async loadMessages(): Promise<Message[]> {
    return chatRepository.fetchMessages(200);
  }

  async sendMessage(userName: string, content: string): Promise<Message> {
    const trimmed = content.trim();
    if (!trimmed) throw new Error('Message cannot be empty');

    const message = await chatRepository.insertMessage(userName, trimmed);

    // Auto-detect and store questions
    if (detectQuestion(trimmed)) {
      try {
        await questionRepository.insertQuestion(message.id, trimmed, userName);
      } catch {
        // Non-critical: question storage failure doesn't block chat
        console.warn('Failed to store question');
      }
    } else {
      // Answer any open questions when someone responds (simple heuristic)
      try {
        await this.answerPendingQuestions(userName);
      } catch {
        console.warn('Failed to update question statuses');
      }
    }

    return message;
  }

  private async answerPendingQuestions(responderName: string): Promise<void> {
    const openQuestions = await questionRepository.fetchOpenQuestions();
    // Mark open questions as answered if a different user responds
    const othersQuestions = openQuestions.filter((q) => q.asked_by !== responderName);
    for (const q of othersQuestions) {
      await questionRepository.markAnswered(q.id);
    }
  }

  subscribeToMessages(onMessage: (msg: Message) => void): RealtimeChannel {
    return chatRepository.subscribeToMessages(onMessage);
  }

  unsubscribe(channel: RealtimeChannel): void {
    chatRepository.unsubscribe(channel);
  }
}

export const chatService = new ChatService();