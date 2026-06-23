import type { ReactNode } from 'react';

interface ChatLayoutProps {
  header: ReactNode;
  sidebar: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  statusBanner?: ReactNode;
}

export function ChatLayout({ header, sidebar, footer, children, statusBanner }: ChatLayoutProps) {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col">
        {header}
        {statusBanner}
        <main className="flex-1 overflow-y-auto scrollbar-thin">{children}</main>
        {footer}
      </div>
      <aside className="w-full shrink-0 border-t border-surface-border bg-surface lg:w-80 lg:border-l lg:border-t-0">
        {sidebar}
      </aside>
    </div>
  );
}
