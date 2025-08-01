import React, { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import StockGPT from "./components/StockGPT";
import Analyze from "./components/Analyze";
import Watchlist from "./components/Watchlist";

export default function StockGPTApp() {
  const [selectedMenu, setSelectedMenu] = useState("StockGPT");

  // Helper to render the selected feature component
  const renderMainContent = () => {
    switch (selectedMenu) {
      case "StockGPT":
        return <StockGPT />;
      case "Analyze":
        return <Analyze />;
      case "Watchlist":
        return <Watchlist />;
      default:
        return <StockGPT />;
    }
  };

  return (
    <div className="flex flex-row w-screen h-screen items-center min-h-screen">
      <SideNav 
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
      />
      <div className="h-full w-full flex flex-col justify-between bg-gray-900 overflow-hidden">
        <Header />
        <div className="flex flex-col grow shadow-lg bg-gray-900 overflow-y-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
