import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Move, TrendingUp, Maximize2 } from 'lucide-react';
import CandlestickChart from './CandlestickChart';
import ChartControls from './ChartControls';

interface ChartViewProps {
  selectedCrypto: string;
}

const ChartView: React.FC<ChartViewProps> = ({ selectedCrypto }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candlestick');
  const [annotations, setAnnotations] = useState<any[]>([]);

  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1D', '1W', '1M'];

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">{selectedCrypto}/USD Chart</h3>
            <div className="flex items-center space-x-2">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <ZoomOut className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Move className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <TrendingUp className="w-4 h-4" />
            </button>
            <button className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <CandlestickChart 
          crypto={selectedCrypto} 
          timeframe={timeframe}
          chartType={chartType}
        />
      </div>

      {/* Chart Controls */}
      <ChartControls 
        chartType={chartType}
        setChartType={setChartType}
        annotations={annotations}
        setAnnotations={setAnnotations}
      />
    </div>
  );
};

export default ChartView;