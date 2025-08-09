import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Target } from 'lucide-react';

interface AISignalsProps {
  selectedCrypto: string;
}

const AISignals: React.FC<AISignalsProps> = ({ selectedCrypto }) => {
  const signals = [
    {
      type: 'BUY',
      confidence: 87,
      price: '42,500',
      reason: 'RSI oversold + fibonacci bounce',
      timeframe: '4h',
    },
    {
      type: 'SELL',
      confidence: 65,
      price: '44,200',
      reason: 'Resistance at 0.618 fib level',
      timeframe: '1d',
    },
    {
      type: 'WATCH',
      confidence: 73,
      price: '41,800',
      reason: 'Strong support zone',
      timeframe: '1h',
    },
  ];

  const thresholds = [
    { level: 'Support', price: '41,200', strength: 'Strong', tests: 5 },
    { level: 'Resistance', price: '45,500', strength: 'Moderate', tests: 3 },
    { level: 'Break Below', price: '40,000', strength: 'Critical', tests: 1 },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">AI Signals</h3>
      
      <div className="space-y-3 mb-6">
        {signals.map((signal, index) => (
          <div key={index} className="p-4 bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {signal.type === 'BUY' && <TrendingUp className="w-4 h-4 text-green-400" />}
                {signal.type === 'SELL' && <TrendingDown className="w-4 h-4 text-red-400" />}
                {signal.type === 'WATCH' && <AlertCircle className="w-4 h-4 text-yellow-400" />}
                <span className={`font-semibold ${
                  signal.type === 'BUY' ? 'text-green-400' : 
                  signal.type === 'SELL' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {signal.type}
                </span>
              </div>
              <span className="text-sm bg-gray-600 px-2 py-1 rounded">{signal.timeframe}</span>
            </div>
            <div className="text-sm text-gray-300 mb-2">${signal.price}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{signal.reason}</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  signal.confidence > 80 ? 'bg-green-400' : 
                  signal.confidence > 60 ? 'bg-yellow-400' : 'bg-red-400'
                }`} />
                <span className="text-xs text-gray-400">{signal.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-4">
        <h4 className="font-semibold mb-3 flex items-center space-x-2">
          <Target className="w-4 h-4" />
          <span>Key Levels</span>
        </h4>
        <div className="space-y-2">
          {thresholds.map((threshold, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{threshold.level}</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold">${threshold.price}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  threshold.strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                  threshold.strength === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {threshold.strength}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AISignals;