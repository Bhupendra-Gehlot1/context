import { useState, useEffect, useRef, useCallback } from "react";
import { chatService } from "../../../core/services/ChatService";
import { useUser } from "../../../app/providers/UserProvider";
import { UI_COPY } from "../../../core/constants/ui-copy";
import { TIMEOUTS } from "../../../core/constants/timeouts";
import type { Message } from "../../../core/models";

export interface ChatControllerState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isSending: boolean;
  isConnected: boolean;
  sendMessage: (content: string) => Promise<void>;
  retryLoad: () => void;
}

export function useChatController(): ChatControllerState {
  const { userName } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const channelRef = useRef<ReturnType<
    typeof chatService.subscribeToMessages
  > | null>(null);
  const seenIdsRef = useRef<Set<string>>(new Set());

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const msgs = await chatService.loadMessages();
      msgs.forEach((m) => seenIdsRef.current.add(m.id));
      setMessages(msgs);
    } catch {
      setError(UI_COPY.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();

    const channel = chatService.subscribeToMessages((msg) => {
      if (!seenIdsRef.current.has(msg.id)) {
        seenIdsRef.current.add(msg.id);
        setMessages((prev) => [...prev, msg]);
      }
    });

    channelRef.current = channel;

    const handleStatus = () => {
      const status = channel.state;
      if (status === "joined") {
        setIsConnected(true);
      } else if (status === "closed" || status === "errored") {
        setIsConnected(false);
      }
    };

    channel.on("system", {}, handleStatus);

    const reconnectTimer = setInterval(() => {
      if (channel.state !== "joined") {
        setIsConnected(false);
      }
    }, TIMEOUTS.RECONNECT_DELAY_MS);

    return () => {
      clearInterval(reconnectTimer);
      chatService.unsubscribe(channel);
    };
  }, [loadMessages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!userName || !content.trim() || isSending) return;
      try {
        setIsSending(true);
        setError(null);
        await chatService.sendMessage(userName, content);
      } catch {
        setError(UI_COPY.errors.sendFailed);
      } finally {
        setIsSending(false);
      }
    },
    [userName, isSending],
  );

  return {
    messages,
    isLoading,
    error,
    isSending,
    isConnected,
    sendMessage,
    retryLoad: loadMessages,
  };
}
