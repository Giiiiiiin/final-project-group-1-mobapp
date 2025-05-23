import React, { createContext, useState, useContext } from 'react';

export type Role = 'admin' | 'shopkeeper' | 'renter' | null;
export type RentalStatus = 'Renting' | 'Rented';
export type MessageType = 'request' | 'notification' | 'response' | 'reply';

export interface ImageData {
  uri: string;
  type?: string;
  name?: string;
}

export interface Equipment {
  id: string;
  name: string;
  price: string;
  paymentPlanIds: string[];
  description?: string;
  categories?: string[];
  images: string[];
  status: RentalStatus;
  selectedPlanId?: string;
  totalExtensions?: number;
  isReturnPending?: boolean;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: string;
  type: MessageType;
  planId?: string;
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
  messages?: Message[];
  equipmentRentedList?: Equipment[];
}

export interface PaymentPlan {
  id: string;
  title: string;
  durationDays: number;
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
  sendMessage: (
    toUserId: string,
    fromUserId: string,
    content: string,
    type: MessageType,
    planId?: string
  ) => void;
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
    equipmentList: [
      {
        id: 'eq1',
        name: 'Longsword',
        price: '500',
        paymentPlanIds: ['1', '2'],
        description: 'A finely forged longsword ideal for mid-range combat.',
        categories: ['Longsword'],
        images: ['https://www.historicaleuropeanmartialarts.com/wp-content/uploads/2022/06/federschwert-best-hema-practice-swords-guide-1024x921-1.png '],
        status: 'Renting',
      },
      {
        id: 'eq2',
        name: 'Zweihander',
        price: '750',
        paymentPlanIds: ['1'],
        description: 'A massive two-handed sword for powerful strikes.',
        categories: ['Longsword'],
        images: ['https://medenraider.com/wp-content/uploads/2024/05/synthetic-zweihander.jpg '],
        status: 'Renting',
      },
      {
        id: 'eq3',
        name: 'Shield',
        price: '300',
        paymentPlanIds: ['2'],
        description: 'Sturdy shield suitable for defense.',
        categories: ['Shield'],
        images: ['https://i.ebayimg.com/images/g/H8wAAOSw31tk1-3-/s-l1200.jpg '],
        status: 'Renting',
      },
      {
        id: 'eq4',
        name: 'Armor',
        price: '900',
        paymentPlanIds: ['1', '2'],
        description: 'Protective armor set for full-body defense.',
        categories: ['Armor'],
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn :ANd9GcTYLif5pYV1Q7nxpsOKBH-7RrP8ZjdidQ6uJA&s'],
        status: 'Renting',
      },
      {
        id: 'eq5',
        name: 'Rapier',
        price: '450',
        paymentPlanIds: ['1'],
        description: 'Lightweight and fast piercing weapon.',
        categories: ['Rapier'],
        images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn :ANd9GcR2F87DxV7qSsQfKyILHjE3Lb2wCdQ_PpvAiA&s'],
        status: 'Renting',
      },
    ],
    messages: [],
    equipmentRentedList: [],
  },
  {
    id: '3',
    email: 'renter@gmail.com',
    password: 'renter',
    role: 'renter',
    currentlyBorrowedList: [],
    previouslyBorrowedList: [],
    messages: [],
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
    },
    {
      id: '2',
      title: 'Premium Monthly',
      durationDays: 30,
    },
  ]);

  const registerUser = (email: string, password: string, role: Role, profileImage?: string) => {
    const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: String(users.length + 1),
      email,
      password,
      role,
      profileImage: profileImage ? { uri: profileImage } : undefined,
      equipmentList: role === 'shopkeeper' ? [] : undefined,
      currentlyBorrowedList: role === 'renter' ? [] : undefined,
      previouslyBorrowedList: role === 'renter' ? [] : undefined,
      messages: [],
      equipmentRentedList: role === 'shopkeeper' ? [] : undefined,
    };

    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const loginUser = (email: string, password: string): boolean => {
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  const updateUserEquipment = (userId: string, newList: Equipment[]) => {
    setUsers(prev =>
      prev.map(user =>
        user.id === userId ? { ...user, equipmentList: newList } : user
      )
    );

    if (currentUser?.id === userId) {
      setCurrentUser(prev => (prev ? { ...prev, equipmentList: newList } : prev));
    }
  };

  const sendMessage = (
    toUserId: string,
    fromUserId: string,
    content: string,
    type: MessageType,
    planId?: string
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      fromUserId,
      toUserId,
      content,
      timestamp: new Date().toISOString(),
      type,
      planId,
    };

    setUsers(prev =>
      prev.map(user =>
        user.id === toUserId
          ? { ...user, messages: [...(user.messages || []), newMessage] }
          : user
      )
    );

    if (currentUser?.id === toUserId) {
      setCurrentUser(prev => (prev ? { ...prev, messages: [...(prev.messages || []), newMessage] } : prev));
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
        sendMessage,
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