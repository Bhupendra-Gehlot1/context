import { usePresenceController } from "../hooks/usePresenceController";
import { UI_COPY } from "../../../core/constants/ui-copy";
import { Avatar } from "../../../shared/components/Avatar";
import { EmptyState } from "../../../shared/empty-states/EmptyState";
import { useUser } from "../../../app/providers/UserProvider";

export function PresencePanel() {
  const { onlineUsers } = usePresenceController();
  const { userId } = useUser();

  const others = onlineUsers.filter((u) => u.user_id !== userId);

  return (
    <section aria-labelledby="presence-heading">
      <h3
        id="presence-heading"
        className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400"
      >
        {UI_COPY.presence.title} ({onlineUsers.length})
      </h3>

      {others.length === 0 ? (
        <EmptyState title={UI_COPY.presence.empty} />
      ) : (
        <ul className="space-y-2" role="list">
          {onlineUsers.map((u) => (
            <li key={u.user_id} className="flex items-center gap-2.5">
              <Avatar name={u.user_name} size="sm" />
              <span className="text-sm text-slate-200">
                {u.user_name}
                {u.user_id === userId && (
                  <span className="ml-1 text-xs text-slate-500">
                    ({UI_COPY.chat.you})
                  </span>
                )}
              </span>
              <span
                className="ml-auto h-2 w-2 rounded-full bg-emerald-400"
                aria-label="Online"
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
