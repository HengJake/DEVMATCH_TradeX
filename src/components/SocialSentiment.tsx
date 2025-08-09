import React, { useState } from 'react';
import { Twitter, Newspaper, TrendingUp, MessageCircle, Users, Activity } from 'lucide-react';

interface SocialSentimentProps {
  selectedCrypto: string;
}

const SocialSentiment: React.FC<SocialSentimentProps> = ({ selectedCrypto }) => {
  const [timeRange, setTimeRange] = useState('24h');
  
  const sentimentData = {
    overall: 68,
    twitter: 72,
    news: 65,
    reddit: 70,
    telegram: 66,
  };

  const twitterPosts = [
    {
      author: '@crypto_whale',
      content: `$${selectedCrypto} showing strong accumulation patterns. Smart money is buying the dip. 📈`,
      sentiment: 'bullish',
      engagement: '1.2k',
      time: '2h ago',
    },
    {
      author: '@market_analyst',
      content: `Technical analysis suggests ${selectedCrypto} might test lower support levels before bounce`,
      sentiment: 'bearish',
      engagement: '856',
      time: '4h ago',
    },
    {
      author: '@defi_builder',
      content: `Institutional adoption of ${selectedCrypto} reaching new highs. Long-term bullish thesis intact.`,
      sentiment: 'bullish',
      engagement: '2.1k',
      time: '6h ago',
    },
  ];

  const newsArticles = [
    {
      title: `${selectedCrypto} Technical Analysis: Key Levels to Watch`,
      source: 'CryptoNews',
      sentiment: 'neutral',
      time: '1h ago',
    },
    {
      title: `Major Institution Adds ${selectedCrypto} to Portfolio`,
      source: 'BlockchainToday',
      sentiment: 'bullish',
      time: '3h ago',
    },
    {
      title: `Market Volatility Expected as ${selectedCrypto} Approaches Key Resistance`,
      source: 'CoinDesk',
      sentiment: 'bearish',
      time: '5h ago',
    },
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'bg-green-500/20 border-green-500/30';
      case 'bearish': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-yellow-500/20 border-yellow-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Social Sentiment Analysis</h3>
          <div className="flex space-x-2">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Overall', value: sentimentData.overall, icon: Activity },
          { label: 'Twitter/X', value: sentimentData.twitter, icon: Twitter },
          { label: 'News', value: sentimentData.news, icon: Newspaper },
          { label: 'Reddit', value: sentimentData.reddit, icon: MessageCircle },
          { label: 'Telegram', value: sentimentData.telegram, icon: Users },
        ].map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
              <Icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <p className="text-sm text-gray-400 mb-1">{item.label}</p>
              <p className={`text-2xl font-bold ${
                item.value > 60 ? 'text-green-400' : item.value > 40 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {item.value}%
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Twitter/X Feed */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Twitter className="w-5 h-5" />
            <span>Twitter/X Sentiment</span>
          </h3>
          
          <div className="space-y-4">
            {twitterPosts.map((post, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getSentimentBg(post.sentiment)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-blue-400">{post.author}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">{post.engagement}</span>
                    <span className="text-xs text-gray-500">{post.time}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-2">{post.content}</p>
                <span className={`text-xs font-medium capitalize ${getSentimentColor(post.sentiment)}`}>
                  {post.sentiment}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* News Sentiment */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
            <Newspaper className="w-5 h-5" />
            <span>News Analysis</span>
          </h3>
          
          <div className="space-y-4">
            {newsArticles.map((article, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getSentimentBg(article.sentiment)}`}>
                <h4 className="font-semibold text-white mb-2">{article.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{article.source}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium capitalize ${getSentimentColor(article.sentiment)}`}>
                      {article.sentiment}
                    </span>
                    <span className="text-xs text-gray-500">{article.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sentiment Trends */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Sentiment Trends</h3>
        <div className="h-48 bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 text-blue-400" />
            <p className="text-gray-400">Sentiment chart visualization</p>
            <p className="text-sm text-gray-500">Shows sentiment changes over time</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSentiment;