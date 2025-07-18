import type { AuthSlice, UserInfo } from "../Interface";

export const createAuthSlice = (set: (state: Partial<AuthSlice>) => void): AuthSlice => ({
  userInfo: undefined,
  setUserInfo: (userInfo: UserInfo | undefined) => set({ userInfo }),
});