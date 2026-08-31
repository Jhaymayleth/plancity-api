import { createContext } from "react";

import type {
  AuthResponse,
  LoginData,
  RegisterData,
} from "../types/auth";

import type { User } from "../types/user";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;

  login: (data: LoginData) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);