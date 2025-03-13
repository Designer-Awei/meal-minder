"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RecognitionResultProps {
  result: string;
  isLoading: boolean;
  onClose: () => void;
  onAddToList: (ingredients: IngredientItem[]) => void;
}

/**
 * 食材项目接口
 */
export interface IngredientItem {
  id: string;
  name: string;
  quantity: string;
  weight: string;
  isEditing: boolean;
}

/**
 * 识别结果展示组件
 */
const RecognitionResult: React.FC<RecognitionResultProps> = ({
  result,
  isLoading,
  onClose,
  onAddToList
}) => {
  // 解析结果并生成带有唯一ID的食材项目
  const parseResultItems = React.useCallback(() => {
    if (!result || isLoading) return [];
    
    // 按行分割结果
    return result
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map((line, index) => {
        // 移除行首的数字和点（如果有）
        const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
        
        // 尝试解析食材名称、数量和重量
        const match = cleanLine.match(/^(.+?)：(.+?)（约(.+?)）$/);
        
        if (match) {
          return {
            id: `ingredient-${index}-${Date.now()}`,
            name: match[1].trim(),
            quantity: match[2].trim(),
            weight: match[3].trim(),
            isEditing: false
          };
        }
        
        // 如果无法解析，则将整行作为名称
        return {
          id: `ingredient-${index}-${Date.now()}`,
          name: cleanLine,
          quantity: '',
          weight: '',
          isEditing: false
        };
      });
  }, [result, isLoading]);

  // 食材列表状态
  const [ingredientItems, setIngredientItems] = useState<IngredientItem[]>(() => parseResultItems());

  // 当结果变化时更新食材列表
  React.useEffect(() => {
    setIngredientItems(parseResultItems());
  }, [result, parseResultItems]);

  // 更新食材信息
  const handleUpdateItem = (id: string, field: keyof IngredientItem, value: string) => {
    setIngredientItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // 删除食材
  const handleDelete = (id: string) => {
    setIngredientItems(prev => prev.filter(item => item.id !== id));
  };

  // 添加新食材
  const handleAddNew = () => {
    const newItem: IngredientItem = {
      id: `ingredient-new-${Date.now()}`,
      name: '',
      quantity: '',
      weight: '',
      isEditing: false
    };
    setIngredientItems(prev => [...prev, newItem]);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* 标题栏 */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-medium">识别结果</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        
        {/* 内容区域 */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">正在识别食材...</p>
            </div>
          ) : ingredientItems.length > 0 ? (
            <div className="space-y-3">
              {/* 表头 */}
              <div className="flex items-center px-4 text-sm text-gray-500">
                <div className="w-[40%]">类别</div>
                <div className="w-[20%]">数量</div>
                <div className="w-[20%]">重量</div>
                <div className="w-[20%] text-center">操作</div>
              </div>
              
              {ingredientItems.map((item) => (
                <motion.div 
                  key={item.id}
                  className="p-3 bg-orange-50 rounded-lg shadow-sm border border-orange-100"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                      className="w-[40%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                      placeholder="食材名称"
                    />
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                      className="w-[20%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                      placeholder="数量"
                    />
                    <input
                      type="text"
                      value={item.weight}
                      onChange={(e) => handleUpdateItem(item.id, 'weight', e.target.value)}
                      className="w-[20%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
                      placeholder="重量(克)"
                    />
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
              
              {/* 添加新食材按钮 */}
              <motion.button
                className="w-full p-3 border border-dashed border-orange-300 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors"
                onClick={handleAddNew}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                + 添加食材
              </motion.button>
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
              {result || "无法识别图片中的食材"}
            </p>
          )}
        </div>
        
        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
          >
            取消
          </button>
          <button
            onClick={() => {
              // 将编辑后的食材列表传递给父组件
              // 只有名称是必填的，数量和重量至少填一个
              const validItems = ingredientItems.filter(item => 
                item.name.trim() !== '' && (item.quantity.trim() !== '' || item.weight.trim() !== '')
              );
              onAddToList(validItems);
            }}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white"
            disabled={isLoading || ingredientItems.length === 0}
          >
            添加到粮仓
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RecognitionResult; 