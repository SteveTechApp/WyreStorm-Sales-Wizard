import React, { createContext, useContext, ReactNode } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

export type UserContextType = ReturnType<typeof useUserProfile>;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const userProfileData = useUserProfile();
  return (
    <UserContext.Provider value={userProfileData}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};