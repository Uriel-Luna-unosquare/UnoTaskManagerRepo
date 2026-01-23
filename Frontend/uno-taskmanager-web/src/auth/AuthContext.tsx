import { createContext, useContext, useState } from "react";
import { login } from "../api/auth.api";

interface AuthContextType {
  token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  async function loginUser(email: string, password: string) {
    const result = await login({ email, password });
    console.log(result);
    localStorage.setItem("token", result.token);
    setToken(result.token);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
