import create from "zustand";

export const useStore = create((set) => ({
  username: [],
  setUsername: (value) => set({ username: value }),
}));
