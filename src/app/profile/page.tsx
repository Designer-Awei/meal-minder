"use client";

import React from 'react';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';

/**
 * 个人页面组件
 */
const ProfilePage = () => {
  // 用户信息
  const user = {
    name: '张三',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    level: 5,
    points: 320,
    favorites: 12,
    recipes: 8
  };

  // 菜单项
  const menuItems = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: '我的收藏',
      count: user.favorites
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: '我的食谱',
      count: user.recipes
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      label: '设置',
      count: null
    }
  ];

  return (
    <main className="relative w-full max-w-[402px] mx-auto min-h-screen bg-white pb-[83px]">
      {/* 用户信息卡片 */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 rounded-b-3xl">
        <div className="flex items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4 text-white">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <div className="flex items-center mt-1">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                Lv.{user.level}
              </span>
              <span className="ml-2 text-sm">
                {user.points} 积分
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 菜单列表 */}
      <div className="p-4 mt-4">
        <h3 className="text-lg font-medium mb-4 px-2">我的功能</h3>
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center">
                <div className="text-gray-500">
                  {item.icon}
                </div>
                <span className="ml-4 text-gray-800">{item.label}</span>
              </div>
              <div className="flex items-center">
                {item.count !== null && (
                  <span className="mr-2 text-sm text-gray-500">{item.count}</span>
                )}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* 版本信息 */}
      <div className="absolute bottom-[100px] left-0 right-0 text-center text-gray-400 text-xs">
        <p>版本 1.0.0</p>
      </div>
      
      {/* 底部导航 */}
      <BottomNavigation />
    </main>
  );
};

export default ProfilePage; 