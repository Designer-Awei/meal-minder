"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ScannerCard = () => {
  return (
    <div className="px-6 py-4">
      <motion.div 
        className="relative w-full h-[243px] rounded-[24px] overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-400"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div 
          className="relative h-full flex flex-col items-center justify-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h2 
            className="text-[32px] leading-[37px] text-center mb-8"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            Enter New<br />Ingredients
          </motion.h2>
          <motion.button 
            className="flex items-center gap-2 bg-white text-[#D64000] px-6 py-3 rounded-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>AI扫描-食材录入</span>
            <motion.svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="1.5"/>
            </motion.svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ScannerCard; 