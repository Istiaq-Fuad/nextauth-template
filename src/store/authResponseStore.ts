import { create } from "zustand";
import { AuthResponseType } from "@/lib/types";

interface AuthResponseState {
  authResponse: AuthResponseType;
  updateAuthResponse: (authResponse: AuthResponseType) => void;
}

const useAuthResponse = create<AuthResponseState>()((set) => ({
  authResponse: {},
  updateAuthResponse: (authResponse) => set({ authResponse }),
}));

export default useAuthResponse;
