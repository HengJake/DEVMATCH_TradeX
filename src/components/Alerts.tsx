import React, { useState } from 'react';
import { Bell, Plus, Trash2, Settings, Zap, Target, TrendingUp } from 'lucide-react';

const Alerts: React.FC = () => {
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  
  const alerts = [
    {
      id: 1,
      crypto: 'BTC',
      type: 'Price Alert',
      condition: 'Above $45,000',
      status: 'Active',
      created: '2 days ago',
    },
    {
      id: 2,
      crypto: 'ETH',
      type: 'AI Signal',
      condition: 'Buy Signal (>80% confidence)',
      status: 'Triggered',
      created: '1 day ago',
    },
    {
      id: 3,
      crypto: 'SOL',
      type: 'Support Break',
      condition: 'Below $90.00',
      status: 'Active',
      created: '3 hours ago',
    },
  ];

  const recentAlerts = [
    {
      message: 'BTC just dipped below your watch-level of $42,500. Consider averaging in?',
      time: '5 minutes ago',
      type: 'price',
    },
    {
      message: 'AI detected strong buy signal for ETH with 87% confidence',
      time: '1 hour ago',
      type: 'ai',
    },
    {
      message: 'SOL showing unusual whale activity - 40% increase in large transactions',
      time: '2 hours ago',
      type: 'whale',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Alert Management */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Alert Management</span>
          </h3>
          <button
            onClick={() => setShowCreateAlert(!showCreateAlert)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Alert</span>
          </button>
        </div>

        {/* Create Alert Form */}
        {showCreateAlert && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
            <h4 className="font-semibold mb-4">Create New Alert</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white">
                <option>BTC</option>
                <option>ETH</option>
                <option>SOL</option>
              </select>
              <select className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white">
                <option>Price Alert</option>
                <option>AI Signal</option>
                <option>Support/Resistance</option>
                <option>Volume Spike</option>
              </select>
              <input
                type="text"
                placeholder="Condition (e.g., > $45,000)"
                className="bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex space-x-3 mt-4">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                Create Alert
              </button>
              <button
                onClick={() => setShowCreateAlert(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Active Alerts */}
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  alert.status === 'Active' ? 'bg-green-400' : 
                  alert.status === 'Triggered' ? 'bg-yellow-400' : 'bg-gray-400'
                }`} />
                <div>
                  <p className="font-semibold">{alert.crypto} - {alert.type}</p>
                  <p className="text-sm text-gray-400">{alert.condition}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  alert.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                  alert.status === 'Triggered' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {alert.status}
                </span>
                <span className="text-xs text-gray-500">{alert.created}</span>
                <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {recentAlerts.map((alert, index) => (
            <div key={index} className="p-4 bg-gray-700 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  {alert.type === 'price' && <Target className="w-4 h-4 text-blue-400" />}
                  {alert.type === 'ai' && <Zap className="w-4 h-4 text-blue-400" />}
                  {alert.type === 'whale' && <TrendingUp className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Settings */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Alert Preferences</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Email Notifications</span>
            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Push Notifications</span>
            <button className="w-12 h-6 bg-gray-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Telegram Alerts</span>
            <button className="w-12 h-6 bg-blue-600 rounded-full relative">
              <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;