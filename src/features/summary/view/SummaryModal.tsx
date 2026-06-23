import type { ConversationSummary } from '../../../core/models';
import { UI_COPY } from '../../../core/constants/ui-copy';
import { Modal } from '../../../shared/modals/Modal';
import { EmptyState } from '../../../shared/empty-states/EmptyState';

interface Props {
  summary: ConversationSummary;
  open: boolean;
  onClose: () => void;
}

function SummarySection({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: string[];
  emptyText?: string;
}) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyText ?? '—'}</p>
      ) : (
        <ul className="space-y-1" role="list">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-slate-200">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function SummaryModal({ summary, open, onClose }: Props) {
  const hasContent = summary.messageCount > 0;

  return (
    <Modal open={open} onClose={onClose} title={UI_COPY.summary.title}>
      {!hasContent ? (
        <EmptyState title={UI_COPY.summary.noMessages} />
      ) : (
        <>
          <p className="mb-4 text-xs text-slate-500">
            {summary.messageCount} {UI_COPY.summary.messagesAnalyzed}
          </p>

          <SummarySection title={UI_COPY.summary.participants} items={summary.participants} />
          <SummarySection
            title={UI_COPY.summary.topics}
            items={summary.topics}
            emptyText={UI_COPY.summary.noTopics}
          />
          <SummarySection
            title={UI_COPY.summary.recentActivity}
            items={summary.recentActivity}
            emptyText={UI_COPY.summary.noActivity}
          />
          <SummarySection title={UI_COPY.summary.openQuestions} items={summary.openQuestions} />
        </>
      )}
    </Modal>
  );
}
