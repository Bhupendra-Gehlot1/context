import { userRepository } from '../repositories/UserRepository';
import type { User } from '../models';

export class UserService {
  async syncUser(id: string, userName: string): Promise<User> {
    return userRepository.upsertUser(id, userName);
  }

  async updateLastSeen(id: string): Promise<void> {
    return userRepository.updateLastSeen(id);
  }
}

export const userService = new UserService();
