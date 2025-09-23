
import React, { createContext, useContext, ReactNode } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { UserProfile } from '../utils/types';

interface UserContextType {
    userProfile: UserProfile | null;
    handleUpdateProfile: (profile: UserProfile) => void;
    isProfileModalOpen: boolean;
    onOpenProfile: () => void;
    onCloseProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userProfileData = useUserProfile();
    // The hook returns a non-nullable profile, but we'll allow null in the context type for flexibility.
    const value = {
      ...userProfileData,
      userProfile: userProfileData.userProfile,
    };
    return (
        <UserContext.Provider value={value}>
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
