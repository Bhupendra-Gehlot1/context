import { createContext, useContext, useState, type ReactNode } from "react";
import { STORAGE_KEYS } from "../../core/constants/storage-keys";
import { generateId } from "../../core/utils";

interface UserContextValue {
  userName: string | null;
  userId: string;
  setUserName: (name: string) => void;
  clearUser: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userName, setUserNameState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME);
  });

  const [userId] = useState<string>(() => {
    const existing = localStorage.getItem(STORAGE_KEYS.USER_ID);
    if (existing) return existing;
    const id = generateId();
    localStorage.setItem(STORAGE_KEYS.USER_ID, id);
    return id;
  });

  const setUserName = (name: string) => {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
    setUserNameState(name);
  };

  const clearUser = () => {
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    setUserNameState(null);
  };

  return (
    <UserContext.Provider value={{ userName, userId, setUserName, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
