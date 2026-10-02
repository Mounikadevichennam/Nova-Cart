import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

const DEMO_USERS = {
  customer: {
    id: "user-1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "customer",
    city: "Mumbai",
    address: "Flat 402, Green Meadows, Marol, Andheri East, Mumbai 400059"
  },
  store_manager: {
    id: "user-mgr-1",
    name: "Vikram Singh",
    email: "manager.subhash@novacart.in",
    role: "store_manager",
    city: "Mumbai",
    store_id: "store-1",
    store_name: "Subhash Stores — Andheri East"
  },
  admin: {
    id: "user-admin-1",
    name: "Aditya Verma",
    email: "admin.network@novacart.in",
    role: "admin",
    city: "Mumbai",
    store_id: null
  }
};

const DEFAULT_STORE = {
  id: "store-1",
  name: "Subhash Stores — Andheri East",
  city: "Mumbai",
  address: "Shop 14, Marol Naka, Andheri East, Mumbai 400059",
  delivery_time_mins: 18,
  rating: 4.8
};

export const UserProvider = ({ children }) => {
  const [role, setRole] = useState('customer'); // 'customer', 'store_manager', 'admin'
  const [activeStore, setActiveStore] = useState(DEFAULT_STORE);
  const currentUser = DEMO_USERS[role] || DEMO_USERS.customer;

  const switchRole = (newRole) => {
    if (DEMO_USERS[newRole]) {
      setRole(newRole);
    }
  };

  return (
    <UserContext.Provider
      value={{
        role,
        currentUser,
        activeStore,
        setActiveStore,
        switchRole,
        demoUsers: DEMO_USERS
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
