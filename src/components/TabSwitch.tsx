"use client";

import React, { useState } from 'react';
import * as Tabs from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";

const TabSwitch = () => {
  const [activeTab, setActiveTab] = useState('shopping');

  return (
    <div className="px-4 py-3">
      <Tabs.Root 
        defaultValue="shopping" 
        className="w-full"
        onValueChange={setActiveTab}
      >
        <Tabs.List className="flex w-full h-12 bg-[rgba(56,48,46,0.05)] rounded-[53px] p-1">
          <TabTrigger value="shopping" isSelected={activeTab === 'shopping'}>
            补货清单
          </TabTrigger>
          <TabTrigger value="recipe" isSelected={activeTab === 'recipe'}>
            每日食谱
          </TabTrigger>
        </Tabs.List>
      </Tabs.Root>
    </div>
  );
};

const TabTrigger = ({ 
  children, 
  value,
  isSelected 
}: { 
  children: React.ReactNode; 
  value: string;
  isSelected: boolean;
}) => {
  return (
    <Tabs.Trigger
      value={value}
      className="flex-1 h-9 rounded-[27px] flex items-center justify-center text-sm relative"
    >
      <AnimatePresence>
        {isSelected && (
          <motion.div
            layoutId="tab-background"
            className="absolute inset-0 bg-white rounded-[27px] shadow-[0px_0px_6px_rgba(251,127,50,0.12)]"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <span className={`relative z-10 ${isSelected ? 'text-[#D64000]' : 'text-[#6E6E6E]'}`}>
        {children}
      </span>
    </Tabs.Trigger>
  );
};

export default TabSwitch; 