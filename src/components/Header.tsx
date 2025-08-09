import React, { useState } from "react";
import { Search, Settings, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useZKLogin } from "../hooks/useZKLogin";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  selectedCrypto: string;
}

const Header: React.FC<HeaderProps> = ({ selectedCrypto }) => {
  const { zkLoginData } = useAuth();
  const { logout } = useZKLogin();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const cryptoPrice =
    selectedCrypto === "BTC"
      ? "42,750.23"
      : selectedCrypto === "ETH"
      ? "2,645.18"
      : "0.62";
  const priceChange =
    selectedCrypto === "BTC"
      ? "+2.45%"
      : selectedCrypto === "ETH"
      ? "-1.23%"
      : "+5.67%";
  const isPositive = !priceChange.startsWith("-");

  const handleLogout = () => {
    logout();
    navigate("/signup");
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">{selectedCrypto}/USD</h2>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold">${cryptoPrice}</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPositive
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {priceChange}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search crypto..."
              className="bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {zkLoginData ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                {zkLoginData.user.picture ? (
                  <img
                    src={zkLoginData.user.picture}
                    alt="User avatar"
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {zkLoginData.user.name || zkLoginData.user.email}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-700">
                    <p className="text-sm font-medium text-white">
                      {zkLoginData.user.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {zkLoginData.user.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Address: {zkLoginData.address.slice(0, 6)}...
                      {zkLoginData.address.slice(-4)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Provider: {zkLoginData.user.provider}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>View Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
