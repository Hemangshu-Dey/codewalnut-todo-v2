import { create } from "zustand";

interface StoreState {
  currentUser: {
    userid: string;
    username: string;
  };
  setCurrentUser: (user: {
    userid: string;
    username: string;
  }) => void;
}

const useStore = create<StoreState>((set) => ({
  currentUser: {
    userid: "",
    username: "",
  },
  setCurrentUser: (user) =>
    set(() => ({
      currentUser: user,
    })),
}));

export default useStore;
