"use client";

import React from 'react';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import Image from 'next/image';

/**
 * 食谱页面组件
 */
const RecipePage = () => {
  // 示例食谱数据
  const recipes = [
    {
      id: 1,
      name: '番茄炒蛋',
      ingredients: ['番茄', '鸡蛋', '葱花', '盐', '糖'],
      time: '15分钟',
      difficulty: '简单',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 2,
      name: '红烧肉',
      ingredients: ['五花肉', '酱油', '料酒', '冰糖', '八角', '桂皮'],
      time: '90分钟',
      difficulty: '中等',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 3,
      name: '清蒸鱼',
      ingredients: ['鲈鱼', '姜', '蒜', '葱', '酱油', '料酒'],
      time: '30分钟',
      difficulty: '中等',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <main className="relative w-full max-w-[402px] mx-auto min-h-screen bg-white pb-[83px]">
      {/* 页面标题 */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-medium text-center">美食食谱</h1>
      </div>
      
      {/* 搜索栏 */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜索食谱..."
            className="w-full p-3 pl-10 bg-gray-100 rounded-lg focus:outline-none"
          />
          <svg 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {/* 食谱列表 */}
      <div className="p-4 space-y-4">
        {recipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-40 overflow-hidden">
              <Image 
                src={recipe.image} 
                alt={recipe.name} 
                width={400}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900">{recipe.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                食材: {recipe.ingredients.join(', ')}
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                  {recipe.time}
                </span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {recipe.difficulty}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* 底部导航 */}
      <BottomNavigation />
    </main>
  );
};

export default RecipePage; 