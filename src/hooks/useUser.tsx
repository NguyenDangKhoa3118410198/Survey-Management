import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IUser {
  id: number;
  fullName: string;
  email: string;
  avatar?: any;
  birthDate: string;
  gender: string;
  password?: string;
  verifyPassword?: string;
  addresses?: IAddress[];
  originBirthDate?: string;
  idsAddress: any[];
  phoneNumber?: string;
}

export interface IAddress {
  city: string | undefined;
  district: string | undefined;
  ward: string | undefined;
}

interface IUseUser {
  userList: IUser[];
  setUserList: (userList: IUser[]) => void;
  addNewUser: (newUser: IUser) => void;
  editUser: (newUser: IUser) => void;
  clearUser: () => void;
}

const useUser = create<IUseUser>()(
  persist(
    (set) => ({
      userList: [],
      setUserList: (userList: IUser[]) => set({ userList }),

      addNewUser: (newUser: IUser) =>
        set((state) => ({ userList: [...state.userList, newUser] })),

      editUser: (updatedUser: IUser) =>
        set((state) => ({
          userList: state.userList.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          ),
        })),

      clearUser: () => set({ userList: [] }),
    }),
    {
      name: 'userList',
    }
  )
);

export default useUser;
