import React, { useState } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hi! I\'m your AI trading assistant. Ask me anything about crypto analysis, market trends, or risk assessment.',
      time: '2 min ago',
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user',
      content: message,
      time: 'Now',
    };

    // Simulate AI response
    const responses = [
      'Based on current market conditions, BTC is showing bullish momentum with RSI at 28.5 indicating oversold conditions. Consider a DCA approach with 15% position sizing.',
      'ETH is approaching a key resistance level at $2,700. The probability of a breakout is 67% based on volume analysis and social sentiment.',
      'The current Fear & Greed index is at 32 (Fear), which historically has been a good buying opportunity. However, always consider your risk tolerance.',
      'Whale wallet activity shows increased accumulation over the past 48 hours. This could signal institutional interest at current price levels.',
    ];

    const botResponse = {
      type: 'bot',
      content: responses[Math.floor(Math.random() * responses.length)],
      time: 'Now',
    };

    setMessages([...messages, userMessage, botResponse]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-40 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">AI Trading Assistant</h3>
            <div className="w-2 h-2 bg-green-400 rounded-full ml-auto"></div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {msg.type === 'bot' ? (
                      <Bot className="w-4 h-4 text-blue-400" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span className="text-xs opacity-75">{msg.time}</span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crypto trends..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;