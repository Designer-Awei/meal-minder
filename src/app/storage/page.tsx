"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from '@/components/BottomNavigation';
import { IngredientItem, formatDateTime, formatWeight } from '@/components/RecognitionResult';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

/**
 * 粮仓页面组件
 */
const StoragePage = () => {
  const [pantryItems, setPantryItems] = useState<IngredientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

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

  // 切换展开/折叠状态
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
            <div className="flex items-center px-3 text-sm text-gray-500">
              <div className="w-[40%] pl-2">类别</div>
              <div className="w-[20%] pl-2">数量</div>
              <div className="w-[25%] pl-2">重量</div>
              <div className="w-[15%] text-center">操作</div>
            </div>
            
            {/* 食材列表 */}
            {pantryItems.map((item) => (
              <motion.div
                key={item.id}
                className="bg-orange-50 rounded-lg shadow-sm border border-orange-100 overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-[40%] p-2 text-sm relative">
                      <div className="flex items-center">
                        <span className="mr-1">{item.name}</span>
                        {item.history && item.history.length > 0 && (
                          <button 
                            onClick={() => toggleExpand(item.id)}
                            className="ml-1 text-gray-500 hover:text-orange-500"
                          >
                            {expandedItems[item.id] ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatDateTime(item.createdAt)}
                      </div>
                    </div>
                    <div className="w-[20%] p-2 text-sm">
                      <div className="flex">
                        <span>{item.quantity.replace(/[^\d.]/g, '')}</span>
                        <span className="text-gray-500 ml-1">{item.quantity.replace(/[\d.]/g, '')}</span>
                      </div>
                    </div>
                    <div className="w-[25%] p-2 text-sm">
                      <div className="flex">
                        <span>{formatWeight(item.weight).replace(/[^\d.]/g, '')}</span>
                        <span className="text-gray-500 ml-1">{formatWeight(item.weight).replace(/[\d.]/g, '')}</span>
                      </div>
                    </div>
                    <div className="w-[15%] flex justify-center items-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* 历史记录 */}
                <AnimatePresence>
                  {expandedItems[item.id] && item.history && item.history.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-orange-100/50 border-t border-orange-200"
                    >
                      <div className="p-3 text-sm">
                        <div className="text-xs font-medium text-gray-500 mb-2">历史记录</div>
                        {item.history.map((historyItem, index) => (
                          <div key={index} className="flex items-center py-1 border-b border-orange-100 last:border-b-0">
                            <div className="w-[40%] p-2 text-sm text-gray-600">
                              {formatDateTime(historyItem.createdAt)}
                            </div>
                            <div className="w-[20%] p-2 text-sm text-gray-600">
                              <div className="flex">
                                <span>{historyItem.quantity.replace(/[^\d.]/g, '')}</span>
                                <span className="text-gray-400 ml-1">{historyItem.quantity.replace(/[\d.]/g, '')}</span>
                              </div>
                            </div>
                            <div className="w-[25%] p-2 text-sm text-gray-600">
                              <div className="flex">
                                <span>{formatWeight(historyItem.weight).replace(/[^\d.]/g, '')}</span>
                                <span className="text-gray-400 ml-1">{formatWeight(historyItem.weight).replace(/[\d.]/g, '')}</span>
                              </div>
                            </div>
                            <div className="w-[15%]"></div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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