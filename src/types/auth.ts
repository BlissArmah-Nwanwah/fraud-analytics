export type LoginRequest = { email: string; password: string };

export type LoginResponse = {
  message: string;
  data: {
    userId: string;
    token: string;
    refreshToken: string;
  };
};

export type ForgotPasswordRequest = { email: string };

export type ForgotPasswordResponse = {
  message: string;
  data: null;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
  username?: string;
};

export type RegisterResponse = {
  message: string;
  data: {
    userId: string;
    token: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
      location: string | null;
      createdAt: string;
      updatedAt: string;
    };
  };
};
