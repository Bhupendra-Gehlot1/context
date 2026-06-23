import { supabase } from '../api/supabase';
import type { Message } from '../models';
import type { RealtimeChannel } from '@supabase/supabase-js';

export class ChatRepository {
  async fetchMessages(limit = 100): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  }

  async insertMessage(userName: string, content: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({ user_name: userName, content })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  subscribeToMessages(onMessage: (msg: Message) => void): RealtimeChannel {
    return supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => onMessage(payload.new as Message)
      )
      .subscribe();
  }

  unsubscribe(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
  }
}

export const chatRepository = new ChatRepository();