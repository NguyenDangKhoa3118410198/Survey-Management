import { defaultPassword } from 'utils';
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
  status?: string;
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
  deleteUser: (userId: number) => void;
  resetPassword: (userId: number) => void;
  clearUser: () => void;
  changeStatusUser: (userId: number, value: string) => void;
  getStatusById: (userId: number) => string | undefined;
}

const useUser = create<IUseUser>()(
  persist(
    (set, get) => ({
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

      deleteUser: (userId: number) =>
        set((state) => ({
          userList: state.userList.filter((user) => user.id !== userId),
        })),

      resetPassword: (userId: number) =>
        set((state) => ({
          userList: state.userList.map((user) => {
            if (user.id === userId) {
              return {
                ...user,
                password: defaultPassword,
                verifyPassword: defaultPassword,
              };
            }
            return user;
          }),
        })),

      changeStatusUser: (userId: number, value: string) =>
        set((state) => ({
          userList: state.userList.map((user) =>
            user.id === userId ? { ...user, status: value } : user
          ),
        })),

      getStatusById: (userId: number) => {
        const user = get().userList.find((user) => user.id === userId);
        return user ? user.status : undefined;
      },

      clearUser: () => set({ userList: [] }),
    }),
    {
      name: 'userList',
    }
  )
);

export default useUser;
