import React from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';
import CryptoList from './CryptoList';
import MarketOverview from './MarketOverview';
import AISignals from './AISignals';

interface DashboardProps {
  selectedCrypto: string;
  setSelectedCrypto: (crypto: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedCrypto, setSelectedCrypto }) => {
  const stats = [
    {
      title: 'Bullish Signals',
      value: '12',
      change: '+3 from yesterday',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      title: 'Bearish Signals',
      value: '5',
      change: '-2 from yesterday',
      icon: TrendingDown,
      color: 'bg-red-500',
    },
    {
      title: 'Risk Alerts',
      value: '8',
      change: '+1 from yesterday',
      icon: AlertTriangle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Threshold Levels',
      value: '23',
      change: 'No change',
      icon: Target,
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-gray-500 text-xs mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}/20`}>
                  <Icon className={`w-6 h-6 text-white`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CryptoList selectedCrypto={selectedCrypto} setSelectedCrypto={setSelectedCrypto} />
        </div>
        <div className="lg:col-span-1">
          <MarketOverview selectedCrypto={selectedCrypto} />
        </div>
        <div className="lg:col-span-1">
          <AISignals selectedCrypto={selectedCrypto} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;