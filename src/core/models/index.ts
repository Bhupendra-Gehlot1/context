export interface Message {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface User {
  id: string;
  user_name: string;
  last_seen: string;
}

export interface Question {
  id: string;
  message_id: string;
  content: string;
  asked_by: string;
  status: 'open' | 'answered';
  created_at: string;
}

export interface PresenceUser {
  user_id: string;
  user_name: string;
  online_at: string;
}

export interface TypingUser {
  user_name: string;
  timestamp: number;
}

export interface ConversationSummary {
  participants: string[];
  topics: string[];
  recentActivity: string[];
  openQuestions: string[];
  messageCount: number;
}