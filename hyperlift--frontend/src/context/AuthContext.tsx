import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, LoginRequest, RegisterRequest } from '../types/AppTypes';
import authService from '../services/authService';
import { getUser, setUser, removeUser } from '../utils/Helpers';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<AuthUser>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthUser | null>(getUser());
  const [isLoading, setIsLoading] = useState(false);

  // Auth is session-cookie based. On first load, re-validate the session
  // with the server rather than blindly trusting the cached localStorage
  // user (the cookie may have expired since the last visit).
  useEffect(() => {
    const cachedUser = getUser();
    if (!cachedUser) return;

    authService
      .me()
      .then((response) => {
        setUser(response.data);
        setUserState(response.data);
      })
      .catch(() => {
        removeUser();
        setUserState(null);
      });
  }, []);

  const login = async (data: LoginRequest): Promise<AuthUser> => {
    setIsLoading(true);
    try {
      const response = await authService.login(data);
      const authUser = response.data;
      setUser(authUser);
      setUserState(authUser);
      return authUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      await authService.register(data);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    removeUser();
    setUserState(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
