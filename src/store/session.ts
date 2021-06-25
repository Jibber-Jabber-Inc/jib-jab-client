import { createStore } from "./utils";

interface SessionState {
  redirectPath: string;
  setRedirectPath: (path: string) => void;
}

export const useSessionStore = createStore<SessionState>((set) => ({
  redirectPath: "",
  setRedirectPath: (path) => set({ redirectPath: path }),
}));
