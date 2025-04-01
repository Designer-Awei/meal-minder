"use client";

import React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { motion } from 'framer-motion';

const ingredients = [
  {
    id: 1,
    name: '土豆',
    amount: '500g',
    recipes: ['番茄土豆牛腩', '醋溜土豆丝'],
    color: 'bg-yellow-200'
  },
  {
    id: 2,
    name: '番茄',
    amount: '800g',
    recipes: ['番茄土豆牛腩', '番茄炒蛋'],
    color: 'bg-red-400'
  },
  {
    id: 3,
    name: '洋葱',
    amount: '300g',
    recipes: ['洋葱炒牛肉', '洋葱炒蛋'],
    color: 'bg-purple-200'
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const IngredientsList = () => {
  return (
    <div className="px-4 pt-1">
      <div className="flex justify-between items-center mb-4">
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg text-[#182A1B]"
        >
          8项待补食材
        </motion.h3>
        <motion.svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <path d="M8 4l6 6-6 6" stroke="rgba(35,29,28,0.8)" strokeWidth="1.5"/>
        </motion.svg>
      </div>
      <ScrollArea.Root className="h-[calc(100vh-400px)] overflow-hidden">
        <ScrollArea.Viewport className="w-full h-full">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {ingredients.map(ingredient => (
              <motion.div
                key={ingredient.id}
                variants={item}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-sm"
              >
                <div className={`w-16 h-16 rounded-xl ${ingredient.color}`}></div>
                <div>
                  <h4 className="text-lg text-[#231D1C]">{ingredient.name}/{ingredient.amount}</h4>
                  <p className="text-xs text-[rgba(35,29,28,0.6)]">
                    PF : {ingredient.recipes.join('、')}...
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar 
          className="flex select-none touch-none p-0.5 bg-black/5 transition-colors duration-150 ease-out hover:bg-black/10 rounded-full"
          orientation="vertical"
        >
          <ScrollArea.Thumb className="flex-1 bg-black/40 rounded-full relative" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </div>
  );
};

export default IngredientsList; 