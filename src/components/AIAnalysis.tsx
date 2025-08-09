import React, { useState } from 'react';
import { Brain, Target, AlertTriangle, TrendingUp, BarChart, Zap } from 'lucide-react';

interface AIAnalysisProps {
  selectedCrypto: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ selectedCrypto }) => {
  const [riskProfile, setRiskProfile] = useState('balanced');
  
  const analysis = {
    trend: {
      direction: 'Bullish',
      strength: 78,
      timeframe: 'Medium-term',
      confidence: 85,
    },
    signals: [
      { type: 'RSI Oversold', value: '28.5', impact: 'High', color: 'green' },
      { type: 'MACD Crossover', value: 'Bullish', impact: 'Medium', color: 'green' },
      { type: 'Volume Spike', value: '+145%', impact: 'High', color: 'green' },
      { type: 'Fear & Greed', value: '25 (Fear)', impact: 'Medium', color: 'yellow' },
    ],
    thresholds: [
      { level: 'Strong Buy', price: '$40,500', probability: '73%' },
      { level: 'Buy Zone', price: '$41,200', probability: '85%' },
      { level: 'Sell Zone', price: '$45,800', probability: '67%' },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Risk Profile Selector */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Brain className="w-5 h-5" />
          <span>AI Risk Profile</span>
        </h3>
        <div className="flex space-x-4">
          {['conservative', 'balanced', 'aggressive'].map((profile) => (
            <button
              key={profile}
              onClick={() => setRiskProfile(profile)}
              className={`flex-1 p-3 rounded-lg capitalize transition-all duration-200 ${
                riskProfile === profile
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {profile}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Analysis */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Trend Analysis</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Direction</span>
              <span className={`font-semibold ${
                analysis.trend.direction === 'Bullish' ? 'text-green-400' : 'text-red-400'
              }`}>
                {analysis.trend.direction}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Strength</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full">
                  <div 
                    className="h-full bg-green-400 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.trend.strength}%` }}
                  />
                </div>
                <span className="text-sm font-semibold">{analysis.trend.strength}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Timeframe</span>
              <span className="font-semibold">{analysis.trend.timeframe}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Confidence</span>
              <span className="font-semibold text-blue-400">{analysis.trend.confidence}%</span>
            </div>
          </div>
        </div>

        {/* AI Signals */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Signal Analysis</span>
          </h3>
          
          <div className="space-y-3">
            {analysis.signals.map((signal, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-semibold">{signal.type}</p>
                  <p className="text-sm text-gray-400">{signal.value}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    signal.color === 'green' ? 'bg-green-500/20 text-green-400' :
                    signal.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {signal.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threshold Analysis */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5" />
          <span>Threshold Analysis</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.thresholds.map((threshold, index) => (
            <div key={index} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold ${
                  threshold.level.includes('Buy') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {threshold.level}
                </span>
                <span className="text-sm bg-gray-600 px-2 py-1 rounded">{threshold.probability}</span>
              </div>
              <p className="text-xl font-bold">{threshold.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Explainable AI */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <BarChart className="w-5 h-5" />
          <span>Why This Signal?</span>
        </h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg border border-green-500/30">
            <h4 className="font-semibold text-green-400 mb-2">BUY Signal Reasoning</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• RSI indicates oversold conditions (28.5 &lt; 30)</li>
              <li>• Price bounced off $41,200 support level 3 times</li>
              <li>• MACD histogram showing bullish divergence</li>
              <li>• Whale wallet inflows increased by 45% in 24h</li>
              <li>• Fear & Greed index at extreme fear (contrarian indicator)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;