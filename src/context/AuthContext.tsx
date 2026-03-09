import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  isActive: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const response = await axios.get(`${API_URL}/me`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(response.data.user);
          setToken(storedToken);
        } catch (error) {
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const signup = async (userData: SignupData) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const response = await axios.put(`${API_URL}/profile`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(response.data.user);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};
