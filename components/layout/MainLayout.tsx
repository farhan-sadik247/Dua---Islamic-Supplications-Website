'use client';

import React from 'react';
import Header from './Header';
import { SettingsProvider } from '@/contexts/SettingsContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SettingsProvider>
      <div className="min-h-screen bg-[#F7F8FA]">
        <Header />
        <div className="pt-[60px]">
          {children}
        </div>
      </div>
    </SettingsProvider>
  );
}
