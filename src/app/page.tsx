import React from 'react';
import UserHeader from '@/components/UserHeader';
import TabSwitch from '@/components/TabSwitch';
import ScannerCard from '@/components/ScannerCard';
import IngredientsList from '@/components/IngredientsList';
import BottomNavigation from '@/components/BottomNavigation';

export default function Home() {
  return (
    <main className="relative w-full max-w-[402px] mx-auto min-h-screen bg-white">
      <UserHeader />
      <TabSwitch />
      <ScannerCard />
      <IngredientsList />
      <BottomNavigation />
    </main>
  );
}
