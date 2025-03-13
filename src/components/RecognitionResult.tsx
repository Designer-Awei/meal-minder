"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit2, Check, X } from 'lucide-react';

export interface RecognitionResultProps {
  onClose: () => void;
  result: string;
  onSave: (items: IngredientItem[]) => void;
  isLoading?: boolean;
}

/**
 * 食材项目接口
 */
export interface IngredientItem {
  id: string;
  name: string;
  quantity: string;
  weight: string;
  isEditing?: boolean;
}

/**
 * 识别结果展示组件
 */
const RecognitionResult: React.FC<RecognitionResultProps> = ({
  result,
  isLoading,
  onClose,
  onSave
}) => {
  // 解析结果并生成带有唯一ID的食材项目
  const parseResultItems = React.useCallback(() => {
    if (!result || isLoading) return [];
    
    // 检查是否为错误信息或未识别出食材的情况
    if (result.includes('识别失败') || result.includes('无法识别') || result.includes('未识别')) {
      return [];
    }
    
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
            <X size={16} />
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
              <div className="flex items-center px-2 text-sm text-gray-500">
                <div className="w-[40%] pl-2">类别</div>
                <div className="w-[25%] pl-2">数量</div>
                <div className="w-[25%] pl-2">重量</div>
                <div className="w-[10%] text-center">删除</div>
              </div>
              
              {ingredientItems.map((item) => (
                <motion.div 
                  key={item.id}
                  className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg shadow-sm border border-orange-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                >
                  <div className="flex items-center gap-2">
                    <div className="w-[40%]">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                        className="w-full p-2 border border-orange-200 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
                        placeholder="类别"
                      />
                    </div>
                    <div className="w-[25%]">
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                        className="w-full p-2 border border-orange-200 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="数量"
                      />
                    </div>
                    <div className="w-[25%]">
                      <input
                        type="text"
                        value={item.weight}
                        onChange={(e) => handleUpdateItem(item.id, 'weight', e.target.value)}
                        className="w-full p-2 border border-orange-200 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="重量"
                      />
                    </div>
                    <div className="w-[10%] flex justify-center items-center">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* 添加新食材按钮 */}
              <motion.button
                className="w-full p-3 border-2 border-dashed border-orange-300 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors font-medium"
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
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 text-orange-500 mb-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-center text-gray-500 mb-2 text-lg font-medium">
                {result.includes('识别失败') ? '识别失败，请重试' : '未识别出食材'}
              </p>
              <p className="text-center text-gray-400 max-w-xs">
                {result.includes('识别失败') ? '请尝试调整拍摄角度或光线后重新识别' : '您可以手动添加食材或尝试重新拍摄'}
              </p>
              <motion.button
                className="mt-6 px-5 py-2.5 bg-orange-50 text-orange-500 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
                onClick={handleAddNew}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                手动添加食材
              </motion.button>
            </div>
          )}
        </div>
        
        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              // 将编辑后的食材列表传递给父组件
              // 类别为必填项，数量和重量填选其一即可保存
              const validItems = ingredientItems.filter(item => 
                item.name.trim() !== '' && (item.quantity.trim() !== '' || item.weight.trim() !== '')
              );
              onSave(validItems);
            }}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 transition-colors shadow-sm"
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