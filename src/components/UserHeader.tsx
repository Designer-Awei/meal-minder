"use client";

import React from 'react';
import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import Image from 'next/image';

const UserHeader = () => {
  const { user, isLoading } = useUser();

  return (
    <div className="flex justify-between items-center p-4 pt-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-200 flex-shrink-0">
          {!isLoading && (
            <Image 
              src={user.avatar} 
              alt={user.name} 
              width={48}
              height={48}
              className="w-full h-full object-cover"
              unoptimized={user.avatar.startsWith('data:')}
            />
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-normal">
            Hello，{isLoading ? '加载中...' : user.name}！
          </h1>
          <p className="text-xs text-[#756E6B]">快来看看今日吃什么吧~</p>
        </div>
      </div>
      <Link href="/profile" className="w-12 h-12 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </Link>
    </div>
  );
};

export default UserHeader; 