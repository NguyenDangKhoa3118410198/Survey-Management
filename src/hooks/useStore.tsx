import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
  token: string | null;
  email: string | null;
  setUser: (email: string, token: string) => void;
  clearUser: () => void;
}

const useStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      setUser: (email, token) => set({ email, token }),
      clearUser: () => set({ email: null, token: null }),
    }),
    {
      name: "info-user",
    }
  )
);

export default useStore;
