import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  token: string | null;
  email: string | null;
  password: string | null;
  isRemembered: boolean;
  setUser: (
    email: string,
    password: string,
    token: string,
    isRemembered: boolean
  ) => void;
  changePassword: (password: string) => void;
  clearUser: () => void;
}

const useStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      password: null,
      isRemembered: false,
      setUser: (email, password, token, isRemembered) =>
        set({ email, password, token, isRemembered }),
      changePassword: (password) => set({ password }),
      clearUser: () => set({ token: null }),
    }),
    {
      name: 'info-user',
    }
  )
);

export default useStore;
