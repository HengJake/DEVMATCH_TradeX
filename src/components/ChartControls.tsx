import React from 'react';
import { PenTool, Square, Circle, Minus, Type, Trash2 } from 'lucide-react';

interface ChartControlsProps {
  chartType: string;
  setChartType: (type: string) => void;
  annotations: any[];
  setAnnotations: (annotations: any[]) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({ 
  chartType, 
  setChartType, 
  annotations, 
  setAnnotations 
}) => {
  const tools = [
    { id: 'trendline', label: 'Trendline', icon: Minus },
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'circle', label: 'Circle', icon: Circle },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'pen', label: 'Pen', icon: PenTool },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Drawing Tools */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Annotation Tools</h3>
        <div className="grid grid-cols-3 gap-3">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                className="flex flex-col items-center space-y-2 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{tool.label}</span>
              </button>
            );
          })}
          <button className="flex flex-col items-center space-y-2 p-3 bg-red-600/20 rounded-lg hover:bg-red-600/30 transition-colors">
            <Trash2 className="w-5 h-5 text-red-400" />
            <span className="text-xs text-red-400">Clear</span>
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <h4 className="font-semibold mb-2">Chart Type</h4>
          <div className="flex space-x-2">
            {['candlestick', 'line', 'area'].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`px-3 py-1 rounded text-sm capitalize transition-colors ${
                  chartType === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Support/Resistance Zones */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Support & Resistance</h3>
        <div className="space-y-3">
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-green-400 font-semibold">Support Zone</span>
              <span className="text-sm text-gray-300">$41,200 - $41,800</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Strong historical support, 5 bounces</p>
          </div>
          
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-red-400 font-semibold">Resistance Zone</span>
              <span className="text-sm text-gray-300">$45,500 - $46,000</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Previous support turned resistance</p>
          </div>
          
          <button className="w-full p-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 transition-colors">
            + Add New Zone
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartControls;