import { create } from "zustand";
import { createAuthSlice } from "./slices/authSlice";
import { createChatSlice } from "./slices/chatSlice";
import { createContactsSlice } from "./slices/contactSlice";

export const useAppStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createChatSlice(...a),
  ...createContactsSlice(...a),
}));