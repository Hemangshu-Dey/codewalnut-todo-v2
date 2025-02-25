import { create } from "zustand";

interface StoreState {
  currentUser: {
    userid: string;
    username: string;
  };
  setCurrentUser: (user: { userid: string; username: string }) => void;

  activeCategory: string;
  setActiveCategory: (category: string) => void;

  categoryReRender: boolean;
  setCategoryReRender: (value: boolean) => void;

  todoReRender: boolean;
  setTodoReRender: (value: boolean) => void;
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

  activeCategory: "",
  setActiveCategory: (category) =>
    set(() => ({
      activeCategory: category,
    })),

  categoryReRender: false,
  setCategoryReRender: (value) =>
    set(() => ({
      categoryReRender: value,
    })),
  todoReRender: false,
  setTodoReRender: (value) =>
    set(() => ({
      todoReRender: value,
    })),
}));

export default useStore;
