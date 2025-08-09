import React from 'react';
import { Activity, DollarSign, Users, Zap } from 'lucide-react';

interface MarketOverviewProps {
  selectedCrypto: string;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ selectedCrypto }) => {
  const marketData = {
    BTC: {
      marketCap: '$835.2B',
      volume: '$24.5B',
      dominance: '48.3%',
      fear: '32 (Fear)',
    },
    ETH: {
      marketCap: '$318.7B',
      volume: '$15.2B',
      dominance: '18.4%',
      fear: '35 (Fear)',
    },
    SOL: {
      marketCap: '$42.1B',
      volume: '$2.8B',
      dominance: '2.1%',
      fear: '45 (Neutral)',
    },
  };

  const data = marketData[selectedCrypto as keyof typeof marketData] || marketData.BTC;

  const metrics = [
    { label: 'Market Cap', value: data.marketCap, icon: DollarSign },
    { label: '24h Volume', value: data.volume, icon: Activity },
    { label: 'Dominance', value: data.dominance, icon: Users },
    { label: 'Fear & Greed', value: data.fear, icon: Zap },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">{metric.label}</span>
              </div>
              <span className="font-semibold">{metric.value}</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
        <h4 className="font-semibold mb-2">AI Market Insight</h4>
        <p className="text-sm text-gray-300">
          {selectedCrypto} is showing {selectedCrypto === 'ETH' ? 'bearish' : 'bullish'} momentum with strong support at key levels. 
          Consider DCA strategy with 15% position sizing.
        </p>
      </div>
    </div>
  );
};

export default MarketOverview;