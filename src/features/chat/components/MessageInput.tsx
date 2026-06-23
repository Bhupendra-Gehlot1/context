import { useState } from 'react';
import { UI_COPY } from '../../../core/constants/ui-copy';
import { Button } from '../../../shared/components/Button';

interface Props {
  sending: boolean;
  onSend: (content: string) => Promise<void>;
  onTyping: () => void;
}

export function MessageInput({ sending, onSend, onTyping }: Props) {
  const [value, setValue] = useState('');

  const submit = async () => {
    const trimmed = value.trim();
    if (!trimmed || sending) return;
    await onSend(trimmed);
    setValue('');
  };

  const isEmpty = !value.trim();

  return (
    <div className="flex items-end gap-2">
      <textarea
        value={value}
        rows={1}
        placeholder={UI_COPY.chat.placeholder}
        aria-label={UI_COPY.chat.placeholder}
        onChange={(e) => {
          setValue(e.target.value);
          onTyping();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-surface-border bg-surface-raised px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
      <Button
        onClick={submit}
        disabled={sending || isEmpty}
        className="shrink-0 px-5 py-2.5"
        aria-label={UI_COPY.chat.send}
      >
        {UI_COPY.chat.send}
      </Button>
    </div>
  );
}
