"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface UserInfo {
  email?: string;
  name?: string;
  picture?: string;
  provider: string;
  createdAt: Date;
}

interface ZKLoginData {
  encodedJwt: string;
  address: string;
  userSalt: string;
  user: UserInfo;
}

interface AuthContextType {
  zkLoginData: ZKLoginData | null;
  setZKLoginData: (
    encodedJwt: string,
    address: string,
    userSalt: string,
    user: UserInfo
  ) => void;
  clearZKLoginData: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = "zkLoginData";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [zkLoginData, setZKLoginDataState] = useState<ZKLoginData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage on mount
  useEffect(() => {
    const restoreAuthState = () => {
      try {
        if (typeof window !== "undefined") {
          const storedData = localStorage.getItem(STORAGE_KEY);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Restore the Date object
            if (parsedData.user && parsedData.user.createdAt) {
              parsedData.user.createdAt = new Date(parsedData.user.createdAt);
            }
            setZKLoginDataState(parsedData);
            console.log("Restored auth state from localStorage:", parsedData);
          }
        }
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        // Clear corrupted data
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuthState();
  }, []);

  const setZKLoginData = (
    encodedJwt: string,
    address: string,
    userSalt: string,
    user: UserInfo
  ) => {
    const newData = { encodedJwt, address, userSalt, user };
    setZKLoginDataState(newData);

    // Persist to localStorage
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
        console.log("Saved auth state to localStorage");
      }
    } catch (error) {
      console.error("Failed to save auth state:", error);
    }
  };

  const clearZKLoginData = () => {
    setZKLoginDataState(null);

    // Clear from localStorage
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        // Also clear related session storage items
        sessionStorage.removeItem("zkLogin_ephemeralKeyPair");
        sessionStorage.removeItem("zkLogin_proof");
        sessionStorage.removeItem("zkLogin_maxEpoch");
        sessionStorage.removeItem("oauth_state");
        sessionStorage.removeItem("userSalt");
        console.log("Cleared auth state from storage");
      }
    } catch (error) {
      console.error("Failed to clear auth state:", error);
    }
  };

  const isAuthenticated = !!zkLoginData;

  return (
    <AuthContext.Provider
      value={{
        zkLoginData,
        setZKLoginData,
        clearZKLoginData,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
