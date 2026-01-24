// app/context/AuthContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// Define the shape of the User object
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

// Define the shape of the API Response
interface ApiResponse {
  user: User;
  token: string;
  permissions: string[];
  [key: string]: any;
}

// Define the shape of the Context
interface AuthContextType {
  user: User | null;
  apiResponse: ApiResponse | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    // Safely casting session to any to access apiResponse, 
    // assuming next-auth session has been extended
    const sessionData = session as any;

    if (sessionData?.apiResponse) {
      setApiResponse(sessionData.apiResponse);
      setUser(sessionData.apiResponse.user);
      setToken(sessionData.apiResponse.token);
    } else {
      setApiResponse(null);
      setUser(null);
      setToken(null);
    }

    setIsLoading(false);
  }, [session, status]);

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...userData } : null));

    // Also update the apiResponse if it exists
    if (apiResponse) {
      setApiResponse({
        ...apiResponse,
        user: {
          ...apiResponse.user,
          ...userData,
        },
      });
    }
  };

  const logout = async () => {
    // Call your logout API if needed
    // await hrmsApi.post('employees/logout');

    // Clear local state
    setApiResponse(null);
    setUser(null);
    setToken(null);

    // NextAuth signOut will handle the session cleanup
  };

  const value: AuthContextType = {
    user,
    apiResponse,
    token,
    isLoading: isLoading || status === 'loading',
    isAuthenticated: !!user && !!token,
    updateUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During build/SSR, return a safe default instead of throwing
    if (typeof window === 'undefined') {
      return {
        user: null,
        apiResponse: null,
        token: null,
        isLoading: true,
        isAuthenticated: false,
        updateUser: () => { },
        logout: async () => { },
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
