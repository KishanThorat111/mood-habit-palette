
import React, { useState } from 'react';
import Dashboard from './Dashboard';
import History from './History';
import BottomTabBar from '@/components/BottomTabBar';

const Index: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  return (
    <div className="relative">
      {/* Content */}
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'history' && <History />}
      
      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
