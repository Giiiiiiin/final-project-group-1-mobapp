import React, { createContext, useState, useContext } from 'react';

export type Role = 'admin' | 'shopkeeper' | 'renter' | null;

interface Theme {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  danger: string;
}

interface GlobalContextProps {
  role: Role;
  setRole: (role: Role) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  theme: Theme;
}

const defaultTheme: Theme = {
  primary: '#1B1F23',       
  accent: '#3D8BFF',        
  background: '#ECEFF1',    
  surface: '#FFFFFF',       
  text: '#121212',          
  textSecondary: '#5A5A5A', 
  danger: '#D32F2F',        
};

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GlobalContext.Provider value={{ role, setRole, isLoggedIn, setIsLoggedIn, theme: defaultTheme }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used within GlobalProvider");
  return context;
};
