import React from 'react';
import { BarChart3, TrendingUp, Bot, MessageSquare, Bell, Home, Shield } from 'lucide-react';
import { ViewType } from '../App';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: Home },
    { id: 'charts' as ViewType, label: 'Charts', icon: BarChart3 },
    { id: 'ai-analysis' as ViewType, label: 'AI Analysis', icon: Bot },
    { id: 'social' as ViewType, label: 'Social Sentiment', icon: MessageSquare },
    { id: 'alerts' as ViewType, label: 'Alerts', icon: Bell },
    { id: 'reports' as ViewType, label: 'Anonymous Reports', icon: Shield },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <TrendingUp className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold">TradeX</h1>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;