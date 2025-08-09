import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoListProps {
  selectedCrypto: string;
  setSelectedCrypto: (crypto: string) => void;
}

const CryptoList: React.FC<CryptoListProps> = ({ selectedCrypto, setSelectedCrypto }) => {
  const cryptos = [
    { symbol: 'BTC', name: 'Bitcoin', price: '42,750.23', change: '+2.45%', trend: 'up' },
    { symbol: 'ETH', name: 'Ethereum', price: '2,645.18', change: '-1.23%', trend: 'down' },
    { symbol: 'SOL', name: 'Solana', price: '95.42', change: '+5.67%', trend: 'up' },
    { symbol: 'ADA', name: 'Cardano', price: '0.62', change: '+3.21%', trend: 'up' },
    { symbol: 'DOT', name: 'Polkadot', price: '7.84', change: '-2.15%', trend: 'down' },
    { symbol: 'LINK', name: 'Chainlink', price: '16.73', change: '+1.45%', trend: 'up' },
  ];

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4">Cryptocurrency List</h3>
      <div className="space-y-3">
        {cryptos.map((crypto) => (
          <button
            key={crypto.symbol}
            onClick={() => setSelectedCrypto(crypto.symbol)}
            className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
              selectedCrypto === crypto.symbol
                ? 'bg-blue-600/20 border-blue-500'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                {crypto.symbol.slice(0, 2)}
              </div>
              <div className="text-left">
                <p className="font-semibold">{crypto.symbol}</p>
                <p className="text-gray-400 text-sm">{crypto.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${crypto.price}</p>
              <div className="flex items-center space-x-1">
                {crypto.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm ${
                  crypto.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {crypto.change}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CryptoList;