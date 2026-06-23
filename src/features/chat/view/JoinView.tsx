import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../app/providers/UserProvider';
import { ROUTES } from '../../../core/constants/routes';
import { UI_COPY } from '../../../core/constants/ui-copy';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';

export default function JoinView() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUserName } = useUser();

  const handleJoin = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError(UI_COPY.join.validation);
      return;
    }
    setUserName(trimmed);
    navigate(ROUTES.CHAT);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleJoin();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20">
            <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">{UI_COPY.join.title}</h1>
          <p className="mt-2 text-sm text-slate-400">{UI_COPY.join.subtitle}</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <Input
            label={UI_COPY.join.placeholder}
            placeholder={UI_COPY.join.placeholder}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            error={error}
            autoFocus
            autoComplete="nickname"
            maxLength={32}
          />
          <Button type="submit" className="w-full py-2.5">
            {UI_COPY.join.button}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">{UI_COPY.app.tagline}</p>
      </div>
    </div>
  );
}
