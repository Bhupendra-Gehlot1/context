import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "../../core/api/supabase";
import { useUser } from "./UserProvider";
import { TIMEOUTS } from "../../core/constants/timeouts";
import { parsePresenceUsers } from "../../core/utils";
import type { PresenceUser, TypingUser } from "../../core/models";

interface PresenceContextValue {
  onlineUsers: PresenceUser[];
  typingUsers: string[];
  setTyping: (isTyping: boolean) => void;
}

const PresenceContext = createContext<PresenceContextValue | null>(null);

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { userName, userId } = useUser();
  const [onlineUsers, setOnlineUsers] = useState<PresenceUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const typingTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!userName || !userId) return;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase.channel("presence-room", {
      config: { presence: { key: userId } },
    });

    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        setOnlineUsers(parsePresenceUsers(channel.presenceState()));
      })
      .on(
        "broadcast",
        { event: "typing" },
        ({ payload }: { payload: TypingUser }) => {
          if (payload.user_name === userName) return;

          setTypingUsers((prev) =>
            prev.includes(payload.user_name)
              ? prev
              : [...prev, payload.user_name],
          );

          if (typingTimersRef.current[payload.user_name]) {
            clearTimeout(typingTimersRef.current[payload.user_name]);
          }

          typingTimersRef.current[payload.user_name] = setTimeout(() => {
            setTypingUsers((prev) =>
              prev.filter((u) => u !== payload.user_name),
            );
            delete typingTimersRef.current[payload.user_name];
          }, TIMEOUTS.TYPING_EXPIRE_MS);
        },
      )
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            user_id: userId,
            user_name: userName,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      Object.values(typingTimersRef.current).forEach(clearTimeout);
      typingTimersRef.current = {};

      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }

      if (channelRef.current) {
        void channelRef.current.untrack().finally(() => {
          supabase.removeChannel(channelRef.current!);
          channelRef.current = null;
        });
      }
    };
  }, [userName, userId]);

  const setTyping = useCallback(
    (isTyping: boolean) => {
      if (!channelRef.current || !userName) return;

      if (typingDebounceRef.current) {
        clearTimeout(typingDebounceRef.current);
      }

      if (isTyping) {
        typingDebounceRef.current = setTimeout(() => {
          channelRef.current?.send({
            type: "broadcast",
            event: "typing",
            payload: { user_name: userName, timestamp: Date.now() },
          });
        }, TIMEOUTS.TYPING_DEBOUNCE_MS);
      }
    },
    [userName],
  );

  return (
    <PresenceContext.Provider value={{ onlineUsers, typingUsers, setTyping }}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence(): PresenceContextValue {
  const ctx = useContext(PresenceContext);
  if (!ctx) throw new Error("usePresence must be used within PresenceProvider");
  return ctx;
}
