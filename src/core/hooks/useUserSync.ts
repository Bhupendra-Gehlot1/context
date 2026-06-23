import { useEffect } from 'react';
import { useUser } from '../../app/providers/UserProvider';
import { userService } from '../services/UserService';
import { TIMEOUTS } from '../constants/timeouts';

export function useUserSync() {
  const { userId, userName } = useUser();

  useEffect(() => {
    if (!userName) return;

    userService.syncUser(userId, userName).catch(() => {
      console.warn('Failed to sync user profile');
    });

    const interval = setInterval(() => {
      userService.updateLastSeen(userId).catch(() => {
        console.warn('Failed to update last seen');
      });
    }, TIMEOUTS.PRESENCE_HEARTBEAT_MS);

    return () => clearInterval(interval);
  }, [userId, userName]);
}
