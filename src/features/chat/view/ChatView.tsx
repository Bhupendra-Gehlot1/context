import { useState, useRef, useEffect } from "react";
import { useChatController } from "../hooks/useChatController";
import { usePresenceController } from "../../presence/hooks/usePresenceController";
import { useSummaryController } from "../../summary/hooks/useSummaryController";
import { useUser } from "../../../app/providers/UserProvider";
import { useUserSync } from "../../../core/hooks/useUserSync";
import { UI_COPY } from "../../../core/constants/ui-copy";
import { MessageBubble } from "../components/MessageBubble";
import { MessageInput } from "../components/MessageInput";
import { ReminderPanel } from "../../reminders/view/ReminderPanel";
import { PresencePanel } from "../../presence/view/PresencePanel";
import { SummaryModal } from "../../summary/view/SummaryModal";
import { ChatLayout } from "../../../shared/layouts/ChatLayout";
import { Button } from "../../../shared/components/Button";
import { Loader } from "../../../shared/loaders/Loader";
import { EmptyState } from "../../../shared/empty-states/EmptyState";

function TypingIndicator({ typingUsers }: { typingUsers: string[] }) {
  if (typingUsers.length === 0) return null;

  let text: string;
  if (typingUsers.length === 1) {
    text = `${typingUsers[0]} ${UI_COPY.presence.typing}`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0]} and ${typingUsers[1]} ${UI_COPY.presence.typing}`;
  } else {
    text = `${typingUsers.length} ${UI_COPY.presence.typingMultiple}`;
  }

  return (
    <p className="px-4 py-1 text-xs italic text-slate-400" aria-live="polite">
      {text}
    </p>
  );
}

export default function ChatView() {
  const { userName } = useUser();
  useUserSync();
  const {
    messages,
    sendMessage,
    isSending,
    isLoading,
    error,
    isConnected,
    retryLoad,
  } = useChatController();
  const { onlineUsers, typingUsers, setTyping } = usePresenceController();
  const { summary } = useSummaryController(messages);
  const [showSummary, setShowSummary] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const header = (
    <header className="flex shrink-0 items-center justify-between border-b border-surface-border px-4 py-3 lg:px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-100">
          {UI_COPY.chat.title}
        </h1>
        <p className="text-xs text-slate-400">
          {onlineUsers.length} {UI_COPY.chat.onlineUsers}
        </p>
      </div>
      <Button variant="secondary" onClick={() => setShowSummary(true)}>
        {UI_COPY.summary.button}
      </Button>
    </header>
  );

  const statusBanner = !isConnected ? (
    <div
      className="flex items-center justify-between bg-amber-500/10 px-4 py-2 text-sm text-amber-300"
      role="alert"
    >
      <span>{UI_COPY.errors.connectionLost}</span>
      <button
        type="button"
        onClick={retryLoad}
        className="underline hover:no-underline focus:outline-none"
      >
        {UI_COPY.chat.reconnecting}
      </button>
    </div>
  ) : null;

  const mainContent = isLoading ? (
    <Loader label={UI_COPY.chat.loadingMessages} />
  ) : error && messages.length === 0 ? (
    <div className="flex flex-col items-center gap-3 py-12">
      <p className="text-sm text-red-400" role="alert">
        {error}
      </p>
      <Button variant="secondary" onClick={retryLoad}>
        {UI_COPY.chat.reconnecting}
      </Button>
    </div>
  ) : messages.length === 0 ? (
    <EmptyState title={UI_COPY.chat.noMessages} />
  ) : (
    <div className="space-y-4 px-4 py-4 lg:px-6">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          currentUser={userName ?? ""}
        />
      ))}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );

  const footer = (
    <footer className="shrink-0 border-t border-surface-border px-4 py-3 lg:px-6">
      {error && messages.length > 0 && (
        <p className="mb-2 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      <TypingIndicator typingUsers={typingUsers} />
      <MessageInput
        sending={isSending}
        onSend={sendMessage}
        onTyping={() => setTyping(true)}
      />
    </footer>
  );

  const sidebar = (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4 scrollbar-thin lg:max-h-screen">
      <PresencePanel />
      <ReminderPanel />
    </div>
  );

  return (
    <>
      <ChatLayout
        header={header}
        sidebar={sidebar}
        footer={footer}
        statusBanner={statusBanner}
      >
        {mainContent}
      </ChatLayout>
      <SummaryModal
        open={showSummary}
        summary={summary}
        onClose={() => setShowSummary(false)}
      />
    </>
  );
}
