import React, { createContext, useState, useContext } from 'react';

export type Role = 'admin' | 'shopkeeper' | 'renter' | null;

export interface ImageData {
  uri: string;
  type?: string;
  name?: string;
}

export interface Equipment {
  id: string;
  name: string;
  price: string;
  plan: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  profileImage?: ImageData;
  equipmentList?: Equipment[];
  currentlyBorrowedList?: Equipment[];
  previouslyBorrowedList?: Equipment[];
}

export interface PaymentPlan {
  id: string;
  title: string;
  durationDays: number;
  cost: number;
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
  users: User[];
  paymentPlans: PaymentPlan[];
  setPaymentPlans: (plans: PaymentPlan[]) => void;
  registerUser: (email: string, password: string, role: Role, profileImage?: string) => void;
  loginUser: (email: string, password: string) => boolean;
  setUsers: (users: User[]) => void;
  updateUserEquipment: (userId: string, newList: Equipment[]) => void;
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
    equipmentList: [],
  },
  {
    id: '3',
    email: 'renter@gmail.com',
    password: 'renter',
    role: 'renter',
    currentlyBorrowedList: [],
    previouslyBorrowedList: [],
  },
];

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(defaultUsers);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([
    {
      id: '1',
      title: 'Basic Weekly',
      durationDays: 7,
      cost: 10,
    },
    {
      id: '2',
      title: 'Premium Monthly',
      durationDays: 30,
      cost: 30,
    },
  ]);

  const registerUser = (email: string, password: string, role: Role, profileImage?: string) => {
    const newUser: User = {
      id: String(users.length + 1),
      email,
      password,
      role,
      profileImage: profileImage ? { uri: profileImage } : undefined,
      equipmentList: role === 'shopkeeper' ? [] : undefined,
      currentlyBorrowedList: role === 'renter' ? [] : undefined,
      previouslyBorrowedList: role === 'renter' ? [] : undefined,
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

  const updateUserEquipment = (userId: string, newList: Equipment[]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, equipmentList: newList } : user
      )
    );

    if (currentUser?.id === userId) {
      setCurrentUser({ ...currentUser, equipmentList: newList });
    }
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
        paymentPlans,
        setPaymentPlans,
        registerUser,
        loginUser,
        setUsers,
        updateUserEquipment,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
