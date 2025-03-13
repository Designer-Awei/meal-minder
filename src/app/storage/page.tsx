"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { IngredientItem } from '@/components/RecognitionResult';

/**
 * 粮仓页面组件
 */
const StoragePage = () => {
  const [pantryItems, setPantryItems] = useState<IngredientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 从本地存储加载食材
  useEffect(() => {
    // 确保代码在客户端执行
    if (typeof window !== 'undefined') {
      try {
        // 使用setTimeout模拟异步加载，避免客户端渲染问题
        setTimeout(() => {
          const storedItems = localStorage.getItem('pantryItems');
          if (storedItems) {
            setPantryItems(JSON.parse(storedItems));
          }
          setIsLoading(false);
        }, 100);
      } catch (error) {
        console.error('加载食材失败:', error);
        setIsLoading(false);
      }
    }
  }, []);

  // 删除食材
  const handleDelete = (id: string) => {
    const updatedItems = pantryItems.filter(item => item.id !== id);
    setPantryItems(updatedItems);
    
    // 更新本地存储
    try {
      localStorage.setItem('pantryItems', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('更新本地存储失败:', error);
    }
  };

  return (
    <main className="relative w-full max-w-[402px] mx-auto min-h-screen bg-white pb-[83px]">
      {/* 页面标题 */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h1 className="text-xl font-medium text-center">我的粮仓</h1>
      </div>
      
      {/* 内容区域 */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : pantryItems.length > 0 ? (
          <div className="space-y-3">
            {/* 表头 */}
            <div className="flex items-center px-4 text-sm text-gray-500">
              <div className="w-[40%]">类别</div>
              <div className="w-[20%]">数量</div>
              <div className="w-[20%]">重量</div>
              <div className="w-[20%] text-center">操作</div>
            </div>
            
            {/* 食材列表 */}
            {pantryItems.map((item) => (
              <motion.div
                key={item.id}
                className="p-3 bg-orange-50 rounded-lg shadow-sm border border-orange-100"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <div className="flex items-center gap-2">
                  <div className="w-[40%] p-2 text-sm">
                    {item.name}
                  </div>
                  <div className="w-[20%] p-2 text-sm">
                    {item.quantity}
                  </div>
                  <div className="w-[20%] p-2 text-sm">
                    {item.weight}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-[20%] flex justify-center items-center p-2 text-red-500 hover:text-red-700 rounded-full"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8h16v16H8V8z" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 14h8M12 12h8" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <p className="mt-4">粮仓空空如也，快去添加食材吧！</p>
          </div>
        )}
      </div>
      
      {/* 底部导航 */}
      <BottomNavigation />
    </main>
  );
};

export default StoragePage; 