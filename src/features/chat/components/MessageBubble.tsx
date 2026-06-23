import { formatTime } from "../../../core/utils";
import { UI_COPY } from "../../../core/constants/ui-copy";
import { Avatar } from "../../../shared/components/Avatar";
import type { Message } from "../../../core/models";

interface Props {
  message: Message;
  currentUser: string;
}

export function MessageBubble({ message, currentUser }: Props) {
  const isMine = message.user_name === currentUser;

  return (
    <div className={`flex gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
      {!isMine && <Avatar name={message.user_name} size="sm" />}

      <div
        className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}
      >
        {!isMine && (
          <span className="mb-1 text-xs font-medium text-slate-400">
            {message.user_name}
          </span>
        )}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isMine
              ? "rounded-br-md bg-accent text-white"
              : "rounded-bl-md bg-surface-raised text-slate-100"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <time
          className="mt-1 text-[10px] text-slate-500"
          dateTime={message.created_at}
          title={new Date(message.created_at).toLocaleString()}
        >
          {isMine ? UI_COPY.chat.you : ""} {formatTime(message.created_at)}
        </time>
      </div>
    </div>
  );
}
