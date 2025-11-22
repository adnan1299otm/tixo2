import { User } from '../types';
import { USERS } from './mockDb';

const CURRENT_USER_KEY = 'socialverse_current_user';

export const login = async (email: string): Promise<User> => {
  // Mock login - allows 'alex' or 'sarah' as simplified login
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = USERS.find(u => u.username.includes(email.split('@')[0].toLowerCase()));
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        resolve(user);
      } else {
        // Default fallback for demo
        const defaultUser = USERS[0];
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
        resolve(defaultUser);
      }
    }, 800);
  });
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.location.href = '/login';
};

export const getCurrentUser = (): User | null => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};