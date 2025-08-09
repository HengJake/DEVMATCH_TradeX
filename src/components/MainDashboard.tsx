import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Dashboard from "./Dashboard";
import ChartView from "./ChartView";
import AIAnalysis from "./AIAnalysis";
import ChatBot from "./ChatBot";
import SocialSentiment from "./SocialSentiment";
import Alerts from "./Alerts";
import Reports from "./Reports";

export type ViewType =
  | "dashboard"
  | "charts"
  | "ai-analysis"
  | "social"
  | "alerts"
  | "reports";

const MainDashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <Dashboard
            selectedCrypto={selectedCrypto}
            setSelectedCrypto={setSelectedCrypto}
          />
        );
      case "charts":
        return <ChartView selectedCrypto={selectedCrypto} />;
      case "ai-analysis":
        return <AIAnalysis selectedCrypto={selectedCrypto} />;
      case "social":
        return <SocialSentiment selectedCrypto={selectedCrypto} />;
      case "alerts":
        return <Alerts />;
      case "reports":
        return <Reports />;
      default:
        return (
          <Dashboard
            selectedCrypto={selectedCrypto}
            setSelectedCrypto={setSelectedCrypto}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1 flex flex-col">
          <Header selectedCrypto={selectedCrypto} />
          <main className="flex-1 p-6">{renderView()}</main>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default MainDashboard;
