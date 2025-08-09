import React, { useState } from 'react';
import { Shield, AlertTriangle, Eye, EyeOff, Lock, Users, CheckCircle, Clock, XCircle, FileText, Zap, TrendingUp } from 'lucide-react';

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'browse' | 'validate'>('browse');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [reportType, setReportType] = useState('market-manipulation');
  const [anonymityLevel, setAnonymityLevel] = useState('high');
  const [stakeAmount, setStakeAmount] = useState('100');

  const reports = [
    {
      id: 'RPT-001',
      title: 'Suspicious Whale Activity on DEX',
      crypto: 'ETH',
      type: 'Market Manipulation',
      status: 'Under Review',
      confidence: 87,
      staked: '500 TOKENS',
      reporter: 'Anonymous Insider',
      reputation: 4.8,
      timeAgo: '2 hours ago',
      description: 'Large coordinated sells followed by immediate buybacks to create artificial volatility',
      evidence: 'On-chain transaction analysis',
      votes: { up: 23, down: 2 },
      aiVerification: 'High correlation with on-chain data',
    },
    {
      id: 'RPT-002',
      title: 'Potential Rug Pull Warning',
      crypto: 'NEWTOKEN',
      type: 'Fraud Alert',
      status: 'Validated',
      confidence: 95,
      staked: '1000 TOKENS',
      reporter: 'Verified Expert',
      reputation: 4.9,
      timeAgo: '6 hours ago',
      description: 'Dev team has been moving funds to unknown wallets, liquidity being drained',
      evidence: 'Contract analysis + insider information',
      votes: { up: 156, down: 8 },
      aiVerification: 'Contract vulnerability confirmed',
    },
    {
      id: 'RPT-003',
      title: 'Coordinated Pump Campaign',
      crypto: 'ALTCOIN',
      type: 'Social Manipulation',
      status: 'Community Voting',
      confidence: 73,
      staked: '250 TOKENS',
      reporter: 'Anonymous Trader',
      reputation: 4.2,
      timeAgo: '1 day ago',
      description: 'Telegram groups coordinating buy orders at specific times',
      evidence: 'Screenshots + social media analysis',
      votes: { up: 45, down: 12 },
      aiVerification: 'Social sentiment spike detected',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validated': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Under Review': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Community Voting': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Market Manipulation': return <TrendingUp className="w-4 h-4" />;
      case 'Fraud Alert': return <AlertTriangle className="w-4 h-4" />;
      case 'Social Manipulation': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold">Anonymous Reporting System</h2>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Lock className="w-4 h-4" />
            <span>Zero-Knowledge Proofs • DID Verification • Token Staking</span>
          </div>
        </div>
        
        <div className="flex space-x-4">
          {[
            { id: 'browse', label: 'Browse Reports', icon: Eye },
            { id: 'submit', label: 'Submit Report', icon: FileText },
            { id: 'validate', label: 'Validate Reports', icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Browse Reports Tab */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center space-x-4">
              <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                <option>All Types</option>
                <option>Market Manipulation</option>
                <option>Fraud Alert</option>
                <option>Social Manipulation</option>
                <option>Insider Trading</option>
              </select>
              <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                <option>All Status</option>
                <option>Under Review</option>
                <option>Community Voting</option>
                <option>Validated</option>
                <option>Rejected</option>
              </select>
              <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                <option>All Cryptos</option>
                <option>BTC</option>
                <option>ETH</option>
                <option>SOL</option>
              </select>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-700 rounded-lg">
                      {getTypeIcon(report.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{report.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                          <span>{report.crypto}</span>
                        </span>
                        <span>{report.type}</span>
                        <span>{report.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className="text-sm font-semibold text-blue-400">{report.confidence}%</span>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{report.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Reporter</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold">{report.reporter}</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <span className="text-xs text-gray-400">{report.reputation}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Staked</p>
                    <p className="text-sm font-semibold text-green-400">{report.staked}</p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Community Votes</p>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-green-400">↑ {report.votes.up}</span>
                      <span className="text-sm text-red-400">↓ {report.votes.down}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">AI Verification:</span>
                    <span className="text-blue-400">{report.aiVerification}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors">
                      Upvote
                    </button>
                    <button className="px-3 py-1 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors">
                      Downvote
                    </button>
                    <button className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Report Tab */}
      {activeTab === 'submit' && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-6">Submit Anonymous Report</h3>
          
          <div className="space-y-6">
            {/* Anonymity Level */}
            <div>
              <label className="block text-sm font-medium mb-3">Anonymity Level</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'low', label: 'Low', desc: 'Basic anonymization' },
                  { id: 'medium', label: 'Medium', desc: 'Tor routing + encryption' },
                  { id: 'high', label: 'High', desc: 'Zero-knowledge proofs' },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setAnonymityLevel(level.id)}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      anonymityLevel === level.id
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="font-semibold">{level.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Report Type */}
            <div>
              <label className="block text-sm font-medium mb-3">Report Type</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="market-manipulation">Market Manipulation</option>
                <option value="fraud-alert">Fraud Alert / Rug Pull</option>
                <option value="social-manipulation">Social Media Manipulation</option>
                <option value="insider-trading">Insider Trading</option>
                <option value="exchange-issues">Exchange Issues</option>
              </select>
            </div>

            {/* Cryptocurrency */}
            <div>
              <label className="block text-sm font-medium mb-3">Cryptocurrency Involved</label>
              <input
                type="text"
                placeholder="e.g., BTC, ETH, or contract address"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-3">Report Title</label>
              <input
                type="text"
                placeholder="Brief, descriptive title"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-3">Detailed Description</label>
              <textarea
                rows={6}
                placeholder="Provide detailed information about the incident, including dates, amounts, and any relevant context..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400"
              />
            </div>

            {/* Evidence */}
            <div>
              <label className="block text-sm font-medium mb-3">Evidence (Optional)</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-400 mb-2">Upload screenshots, documents, or transaction hashes</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                  Choose Files
                </button>
              </div>
            </div>

            {/* Stake Amount */}
            <div>
              <label className="block text-sm font-medium mb-3">Stake Amount (Optional)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                />
                <span className="text-gray-400">TOKENS</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Staking tokens increases credibility and may bypass admin review
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                Submit Anonymous Report
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validate Reports Tab */}
      {activeTab === 'validate' && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Community Validation Queue</h3>
            <p className="text-gray-400 mb-6">
              Help validate reports by reviewing evidence and voting. Earn reputation and token rewards for accurate assessments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-400">47</p>
                <p className="text-sm text-gray-400">Pending Validation</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-400">156</p>
                <p className="text-sm text-gray-400">Your Validations</p>
              </div>
              <div className="p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-400">4.8</p>
                <p className="text-sm text-gray-400">Validation Score</p>
              </div>
            </div>

            <div className="space-y-4">
              {reports.filter(r => r.status === 'Community Voting').map((report) => (
                <div key={report.id} className="p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{report.title}</h4>
                    <span className="text-sm text-blue-400">Reward: 50 TOKENS</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{report.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>Evidence: {report.evidence}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm transition-colors">
                        Validate
                      </button>
                      <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors">
                        Reject
                      </button>
                      <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm transition-colors">
                        Need More Info
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;