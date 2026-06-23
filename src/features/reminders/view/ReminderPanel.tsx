import { useReminderController } from '../hooks/useReminderController';
import { UI_COPY } from '../../../core/constants/ui-copy';
import { Loader } from '../../../shared/loaders/Loader';
import { EmptyState } from '../../../shared/empty-states/EmptyState';
import { formatRelativeTime } from '../../../core/utils';

export function ReminderPanel() {
  const { questions, loading } = useReminderController();

  return (
    <section aria-labelledby="reminders-heading">
      <h3 id="reminders-heading" className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
        {UI_COPY.reminders.title} ({questions.length})
      </h3>

      {loading ? (
        <Loader label={UI_COPY.reminders.loading} />
      ) : questions.length === 0 ? (
        <EmptyState title={UI_COPY.reminders.empty} />
      ) : (
        <ul className="space-y-3" role="list">
          {questions.map((q) => (
            <li
              key={q.id}
              className="rounded-lg border border-surface-border bg-surface-raised/50 p-3"
            >
              <p className="text-sm text-slate-200">{q.content}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-medium text-amber-400">
                  {UI_COPY.reminders.awaitingResponse}
                </span>
                <span className="text-[10px] text-slate-500">
                  {q.asked_by} · {formatRelativeTime(q.created_at)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
