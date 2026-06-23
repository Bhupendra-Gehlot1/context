import { supabase } from "../api/supabase";
import type { User } from "../models";

export class UserRepository {
  async upsertUser(id: string, userName: string): Promise<User> {
    const { data, error } = await supabase
      .from("users")
      .upsert(
        { id, user_name: userName, last_seen: new Date().toISOString() },
        { onConflict: "id" },
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateLastSeen(id: string): Promise<void> {
    const { error } = await supabase
      .from("users")
      .update({ last_seen: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  }
}

export const userRepository = new UserRepository();
