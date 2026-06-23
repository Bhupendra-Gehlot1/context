import { getAvatarColor, getInitials } from '../../core/utils';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md';
}

const sizeClasses = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
};

export function Avatar({ name, size = 'md' }: AvatarProps) {
  const color = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
