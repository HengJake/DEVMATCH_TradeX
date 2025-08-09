import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useZKLogin } from "../hooks/useZKLogin";
import { useNavigate } from "react-router-dom";
import { TransactionService } from "../services/transactionService";
import { formatAddress } from "../lib/utils";
import {
  Wallet,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  Copy,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

interface AccountStats {
  totalTrades: number;
  successfulTrades: number;
  totalVolume: string;
  avgTradeSize: string;
  lastTradeDate: string;
  profitLoss: string;
  winRate: number;
}

interface WalletInfo {
  balance: string;
  networkStatus: {
    epoch: string;
    checkpoint: string;
    latency: number;
  };
  isConnected: boolean;
}

const ProfilePage: React.FC = () => {
  const { zkLoginData, isAuthenticated } = useAuth();
  const { logout } = useZKLogin();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [accountStats, setAccountStats] = useState<AccountStats>({
    totalTrades: 0,
    successfulTrades: 0,
    totalVolume: "0",
    avgTradeSize: "0",
    lastTradeDate: "Never",
    profitLoss: "0",
    winRate: 0,
  });
  const [walletInfo, setWalletInfo] = useState<WalletInfo>({
    balance: "0",
    networkStatus: {
      epoch: "0",
      checkpoint: "0",
      latency: 0,
    },
    isConnected: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signup");
      return;
    }

    // Load real account and blockchain data
    const loadAccountData = async () => {
      if (!zkLoginData?.address) return;

      setIsLoading(true);
      try {
        const transactionService = new TransactionService(
          "https://fullnode.devnet.sui.io"
        );

        // Fetch real balance
        const balanceData = await transactionService.getAccountBalance(
          zkLoginData.address
        );
        const balanceInSui = (
          parseInt(balanceData.toString()) / 1000000000
        ).toFixed(4);

        // Fetch real network status
        const networkStatus = await transactionService.getNetworkStatus();

        // For now, we'll still use mock trading stats since we don't have a real trading history
        // TODO: Replace with real trading data when available
        setAccountStats({
          totalTrades: 0, // No trades yet for real users
          successfulTrades: 0,
          totalVolume: "0",
          avgTradeSize: "0",
          lastTradeDate: "Never",
          profitLoss: "0",
          winRate: 0,
        });

        // Real wallet info
        setWalletInfo({
          balance: balanceInSui,
          networkStatus: {
            epoch: networkStatus.epoch.toString(),
            checkpoint: networkStatus.checkpoint.toString(),
            latency: 50, // Mock latency since it's not provided by the API
          },
          isConnected: true,
        });
      } catch (error) {
        console.error("Error loading account data:", error);
        // Fallback to basic data if blockchain calls fail
        setAccountStats({
          totalTrades: 0,
          successfulTrades: 0,
          totalVolume: "0",
          avgTradeSize: "0",
          lastTradeDate: "Never",
          profitLoss: "0",
          winRate: 0,
        });
        setWalletInfo({
          balance: "0",
          networkStatus: {
            epoch: "Unknown",
            checkpoint: "Unknown",
            latency: 0,
          },
          isConnected: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAccountData();
  }, [isAuthenticated, navigate, zkLoginData?.address]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signup");
  };

  if (!isAuthenticated || !zkLoginData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Profile</h1>
            <p className="text-gray-400">
              Manage your account and view trading statistics
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Info Card */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={zkLoginData.user.picture}
                  alt={zkLoginData.user.name}
                />
                <AvatarFallback>
                  {zkLoginData.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {zkLoginData.user.name || "Anonymous User"}
                </h2>
                <p className="text-gray-400">{zkLoginData.user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="px-2 py-1 bg-blue-600 rounded text-xs font-medium">
                    {zkLoginData.user.provider.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 bg-green-600 rounded text-xs font-medium">
                    ZK Verified
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Member Since
                </h3>
                <p className="text-lg">
                  {zkLoginData.user.createdAt.toLocaleDateString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">
                  Account Status
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-400">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Trades</span>
                <span className="font-semibold">
                  {isLoading ? (
                    <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    accountStats.totalTrades
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Win Rate</span>
                <span className="font-semibold text-green-400">
                  {isLoading ? (
                    <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    `${accountStats.winRate}%`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total P&L</span>
                <span className="font-semibold text-green-400">
                  {isLoading ? (
                    <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    `$${accountStats.profitLoss}`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Wallet className="w-5 h-5 mr-2" />
              Wallet Information
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  ZKLogin Address
                </h4>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-700 px-3 py-2 rounded text-sm font-mono flex-1">
                    {formatAddress(zkLoginData.address, 6)}
                  </code>
                  <button
                    onClick={() =>
                      copyToClipboard(zkLoginData.address, "address")
                    }
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    title="Copy address"
                  >
                    {copiedField === "address" ? (
                      <span className="text-green-400 text-xs">✓</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Balance
                </h4>
                <p className="text-2xl font-bold">
                  {isLoading ? (
                    <div className="w-24 h-8 bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    `${walletInfo.balance} SUI`
                  )}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Network Status
                </h4>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      walletInfo.isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-sm">
                    {walletInfo.isConnected ? "Connected" : "Disconnected"}
                  </span>
                  <span className="text-gray-400 text-sm">
                    ({walletInfo.networkStatus.latency}ms)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Information
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  User Salt
                </h4>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-700 px-3 py-2 rounded text-sm font-mono flex-1">
                    {formatAddress(zkLoginData.userSalt, 8)}
                  </code>
                  <button
                    onClick={() =>
                      copyToClipboard(zkLoginData.userSalt, "salt")
                    }
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    title="Copy salt"
                  >
                    {copiedField === "salt" ? (
                      <span className="text-green-400 text-xs">✓</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Authentication Method
                </h4>
                <p className="text-sm">Zero-Knowledge Login (ZKLogin)</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">
                  Provider
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm capitalize">
                    {zkLoginData.user.provider}
                  </span>
                  <span className="px-2 py-1 bg-blue-600 rounded text-xs">
                    OAuth 2.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Trading Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-1">
                {isLoading ? (
                  <div className="w-16 h-6 bg-gray-700 rounded animate-pulse mx-auto"></div>
                ) : (
                  accountStats.totalTrades
                )}
              </h4>
              <p className="text-gray-400 text-sm">Total Trades</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-1">
                {isLoading ? (
                  <div className="w-16 h-6 bg-gray-700 rounded animate-pulse mx-auto"></div>
                ) : (
                  `$${accountStats.totalVolume}`
                )}
              </h4>
              <p className="text-gray-400 text-sm">Total Volume</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wallet className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-1">
                {isLoading ? (
                  <div className="w-16 h-6 bg-gray-700 rounded animate-pulse mx-auto"></div>
                ) : (
                  `$${accountStats.avgTradeSize}`
                )}
              </h4>
              <p className="text-gray-400 text-sm">Avg Trade Size</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-1">
                {isLoading ? (
                  <div className="w-16 h-6 bg-gray-700 rounded animate-pulse mx-auto"></div>
                ) : (
                  accountStats.lastTradeDate
                )}
              </h4>
              <p className="text-gray-400 text-sm">Last Trade</p>
            </div>
          </div>
        </div>

        {/* Network Information */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Network Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Current Epoch
              </h4>
              <p className="text-lg font-mono">
                {isLoading ? (
                  <div className="w-20 h-6 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  walletInfo.networkStatus.epoch
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Checkpoint
              </h4>
              <p className="text-lg font-mono">
                {isLoading ? (
                  <div className="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  walletInfo.networkStatus.checkpoint
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                Network Latency
              </h4>
              <p className="text-lg">
                {isLoading ? (
                  <div className="w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  `${walletInfo.networkStatus.latency}ms`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
