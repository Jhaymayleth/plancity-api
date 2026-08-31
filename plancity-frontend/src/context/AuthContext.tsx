import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../services/authService";

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

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

const TOKEN_KEY = "accessToken";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getMe();

        setUser(currentUser);
        setToken(storedToken);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await authService.login(data);

    localStorage.setItem(TOKEN_KEY, response.accessToken);

    setToken(response.accessToken);
    setUser(response.user);

    return response;
  };

  const register = async (
    data: RegisterData,
  ): Promise<AuthResponse> => {
    const response = await authService.register(data);

    localStorage.setItem(TOKEN_KEY, response.accessToken);

    setToken(response.accessToken);
    setUser(response.user);

    return response;
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(TOKEN_KEY);

      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}