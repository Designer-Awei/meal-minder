"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const navItems = [
  {
    id: 'home',
    icon: (active: boolean) => (
      <path d="M8 16h16M16 8v16" stroke={active ? "#FA5700" : "#707070"} strokeWidth={active ? 3 : 2}/>
    ),
    label: '首页'
  },
  {
    id: 'storage',
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
  const [activeTab, setActiveTab] = useState('home');

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 max-w-[402px] mx-auto h-[83px] bg-white shadow-[0px_-2px_8px_rgba(0,0,0,0.04)]"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0.2 }}
    >
      <div className="flex justify-around items-center h-[46px] mt-[9px]">
        {navItems.map((item) => (
          <motion.div
            key={item.id}
            className="flex flex-col items-center"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(item.id)}
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