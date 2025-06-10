import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserScopeVisibilityContextType {
  hiddenUserScopes: string[];
  isHiddenForUser: (userId: string) => boolean;
  toggleVisibility: (userId: string) => void;
}

const UserScopeVisibilityContext = createContext<UserScopeVisibilityContextType | undefined>(undefined);

export const UserScopeVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hiddenUserScopes, setHiddenUserScopes] = useState<string[]>([]);

  // Load hidden users from localStorage on mount
  useEffect(() => {
    try {
      const savedHiddenUsers = localStorage.getItem('hidden-user-scopes');
      if (savedHiddenUsers) {
        setHiddenUserScopes(JSON.parse(savedHiddenUsers));
      }
    } catch (error) {
      console.error('Failed to load hidden users:', error);
    }
  }, []);

  // Save hidden users to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('hidden-user-scopes', JSON.stringify(hiddenUserScopes));
    } catch (error) {
      console.error('Failed to save hidden users:', error);
    }
  }, [hiddenUserScopes]);

  const isHiddenForUser = (userId: string): boolean => {
    return hiddenUserScopes.includes(userId);
  };

  const toggleVisibility = (userId: string) => {
    setHiddenUserScopes(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  return (
    <UserScopeVisibilityContext.Provider
      value={{
        hiddenUserScopes,
        isHiddenForUser,
        toggleVisibility
      }}
    >
      {children}
    </UserScopeVisibilityContext.Provider>
  );
};

export const useUserScopeVisibility = () => {
  const context = useContext(UserScopeVisibilityContext);
  if (context === undefined) {
    throw new Error('useUserScopeVisibility must be used within a UserScopeVisibilityProvider');
  }
  return context;
};