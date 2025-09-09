import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SignupState {
  step: number;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  password: string;
  location: string;
}

const initialState: SignupState = {
  step: 1,
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  password: "",
  location: "",
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setField: (
      state,
      action: PayloadAction<{ key: keyof SignupState; value: string | number }>
    ) => {
      const { key, value } = action.payload;
      // @ts-expect-error runtime assignment by key is intended
      state[key] = value as any;
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    resetSignup: () => initialState,
  },
});

export const { setField, setStep, resetSignup } = signupSlice.actions;
export default signupSlice.reducer;
