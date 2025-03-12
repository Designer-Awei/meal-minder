import React from 'react';

const UserHeader = () => {
  return (
    <div className="flex justify-between items-center p-4 pt-12">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-200">
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-normal">Hello，小黄！</h1>
          <p className="text-xs text-[#756E6B]">快来看看今日吃什么吧~</p>
        </div>
      </div>
      <button className="w-12 h-12 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </button>
    </div>
  );
};

export default UserHeader; 