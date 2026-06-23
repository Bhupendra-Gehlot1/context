import { supabase } from "../api/supabase";
import type { Question } from "../models";
import type { RealtimeChannel } from "@supabase/supabase-js";

export class QuestionRepository {
  async fetchOpenQuestions(): Promise<Question[]> {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async fetchAllQuestions(): Promise<Question[]> {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async insertQuestion(
    messageId: string,
    content: string,
    askedBy: string,
  ): Promise<Question> {
    const { data, error } = await supabase
      .from("questions")
      .insert({
        message_id: messageId,
        content,
        asked_by: askedBy,
        status: "open",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async markAnswered(questionId: string): Promise<void> {
    const { error } = await supabase
      .from("questions")
      .update({ status: "answered" })
      .eq("id", questionId);

    if (error) throw error;
  }

  async markAnsweredByMessageId(messageId: string): Promise<void> {
    const { error } = await supabase
      .from("questions")
      .update({ status: "answered" })
      .eq("message_id", messageId);

    if (error) throw error;
  }

  subscribeToQuestions(onChange: () => void): RealtimeChannel {
    return supabase
      .channel("questions-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "questions" },
        onChange,
      )
      .subscribe();
  }

  unsubscribe(channel: RealtimeChannel): void {
    supabase.removeChannel(channel);
  }
}

export const questionRepository = new QuestionRepository();
