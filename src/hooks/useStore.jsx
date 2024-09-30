import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      token: null,
      email: null,
      setUser: (email, token) => set({ email, token }),
      clearUser: () => set({ email: null, token: null }),
    }),
    {
      name: "info-user",
      getStorage: () => localStorage,
    }
  )
);
export default useStore;
