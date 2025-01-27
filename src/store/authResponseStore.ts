import { create } from "zustand";
import { AuthResponseType } from "@/lib/types";

interface AuthResponseState {
  authResponse: AuthResponseType;
  updateAuthResponse: (authResponse: AuthResponseType, timeout?: number) => void;
}

const useAuthResponse = create<AuthResponseState>()((set) => ({
  authResponse: {},
  updateAuthResponse: (authResponse, timeout = 3000) => {
    set({ authResponse }); 

    // Set a timeout to clear the authResponse after the specified time
    setTimeout(() => {
      set({ authResponse: {} }); // Reset the authResponse to an empty object
    }, timeout);
  },
}));

export default useAuthResponse;
