import React, { createContext, useState, useContext } from 'react';

// Types
export type Role = 'admin' | 'shopkeeper' | 'renter' | null;

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  profileImage?: string; // Optional image URI
}

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
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  theme: Theme;
  users: User[]; // Our local "database"
  registerUser: (email: string, password: string, role: Role, profileImage?: string) => void;
  loginUser: (email: string, password: string) => boolean;
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

const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@gmail.com',
    password: 'admin',
    role: 'admin',
  },
  {
    id: '2',
    email: 'shop@gmail.com',
    password: 'shop',
    role: 'shopkeeper',
  },
  {
    id: '3',
    email: 'renter@gmail.com',
    password: 'renter',
    role: 'renter',
  },
];

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);

  const registerUser = (email: string, password: string, role: Role, profileImage?: string) => {
    const newUser: User = {
      id: String(users.length + 1),
      email,
      password,
      role,
      profileImage,
    };

    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const loginUser = (email: string, password: string): boolean => {
    const foundUser = users.find((user) => user.email === email && user.password === password);

    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoggedIn,
        setIsLoggedIn,
        theme: defaultTheme,
        users,
        registerUser,
        loginUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalContext must be used within a GlobalProvider');
  return context;
};