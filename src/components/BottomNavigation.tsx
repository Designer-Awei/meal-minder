"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  {
    id: 'home',
    path: '/',
    icon: (active: boolean) => (
      <path d="M8 16h16M16 8v16" stroke={active ? "#FA5700" : "#707070"} strokeWidth={active ? 3 : 2}/>
    ),
    label: '首页'
  },
  {
    id: 'storage',
    path: '/storage',
    icon: (active: boolean) => (
      <>
        <path d="M8 8h16v16H8V8z" stroke={active ? "#FA5700" : "#707070"} strokeWidth={2}/>
        <path d="M12 14h8M12 12h8" stroke={active ? "#FA5700" : "#707070"} strokeWidth={2}/>
      </>
    ),
    label: '粮仓'
  },
  {
    id: 'recipe',
    path: '/recipe',
    icon: (active: boolean) => (
      <>
        <path d="M16 8C8 8 4 16 4 16s4 8 12 8 12-8 12-8-4-8-12-8z" stroke={active ? "#FA5700" : "#707070"} strokeWidth={2}/>
        <circle cx="16" cy="16" r="4" stroke={active ? "#FA5700" : "#707070"} strokeWidth={2}/>
      </>
    ),
    label: '食谱'
  },
  {
    id: 'profile',
    path: '/profile',
    icon: (active: boolean) => (
      <>
        <circle cx="16" cy="12" r="4" stroke={active ? "#FA5700" : "#707070"} strokeWidth={2}/>
        <path d="M24 24c0-4.4-3.6-8-8-8s-8 3.6-8 8" stroke={active ? "#FA5700" : "#707070"} strokeWidth={2}/>
      </>
    ),
    label: '我的'
  }
];

const BottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // 根据当前路径确定活动标签
  const getActiveTabFromPath = (path: string) => {
    if (path === '/') return 'home';
    if (path === '/storage') return 'storage';
    if (path === '/recipe') return 'recipe';
    if (path === '/profile') return 'profile';
    if (path.startsWith('/scanner')) return 'home';
    return 'home';
  };
  
  // 设置初始状态为'home'，而不是从当前路径派生
  const [activeTab, setActiveTab] = useState('home');
  
  // 当路径变化时更新活动标签
  useEffect(() => {
    if (pathname) {
      setActiveTab(getActiveTabFromPath(pathname));
    }
  }, [pathname]);

  // 处理导航点击
  const handleNavigation = (itemId: string, path: string) => {
    try {
      setActiveTab(itemId);
      router.push(path);
    } catch (error) {
      console.error('导航错误:', error);
    }
  };

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 max-w-[402px] mx-auto h-[83px] bg-white shadow-[0px_-2px_8px_rgba(0,0,0,0.04)] z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0.2 }}
    >
      <div className="flex justify-around items-center h-[46px] mt-[9px]">
        {navItems.map((item) => (
          <motion.div
            key={item.id}
            className="flex flex-col items-center cursor-pointer"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation(item.id, item.path)}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              {item.icon(activeTab === item.id)}
            </svg>
            <span 
              className={`text-[10px] ${
                activeTab === item.id ? 'text-[#FA5700]' : 'text-[#707070]'
              }`}
            >
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="h-[34px] flex items-center justify-center">
        <motion.div 
          className="w-[144px] h-[5px] bg-black rounded-full opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.2, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </motion.nav>
  );
};

export default BottomNavigation; 