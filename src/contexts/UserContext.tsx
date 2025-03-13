"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * 用户信息接口
 */
interface UserInfo {
  name: string;
  avatar: string;
  level: number;
  points: number;
  favorites: number;
  recipes: number;
}

/**
 * 用户上下文接口
 */
interface UserContextType {
  user: UserInfo;
  updateUser: (data: Partial<UserInfo>) => void;
  isLoading: boolean;
}

// 默认用户信息
const defaultUser: UserInfo = {
  name: '小黄',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  level: 1,
  points: 0,
  favorites: 0,
  recipes: 0
};

// 创建上下文
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * 用户上下文提供者组件
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserInfo>(defaultUser);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从本地存储加载用户信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // 更新用户信息
  const updateUser = (data: Partial<UserInfo>) => {
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    // 保存到本地存储
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('保存用户信息失败:', error);
      }
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * 使用用户上下文的钩子
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 