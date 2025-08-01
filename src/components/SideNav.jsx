import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircleQuestion, Brain, TrendingUp, BookmarkPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SideNav = ({ selectedMenu, onMenuSelect }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Define menu items
  const menuItems = [
    { icon: <Brain className="w-5 h-5" />, label: "StockGPT" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Analyze" },
    { icon: <BookmarkPlus className="w-5 h-5" />, label: "Watchlist" },
  ];

  return (
    <aside
      className={`h-full p-4 text-left bg-gray-900 shadow-xl border-r-2 border-gray-800 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 mt-2 h-8">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.h2
              className="text-lg font-bold text-gray-100 whitespace-nowrap overflow-hidden drop-shadow"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 0 }}
            >
              Navigation
            </motion.h2>
          )}
        </AnimatePresence>
        <button
          onClick={handleToggle}
          className="text-gray-100 p-1 rounded hover:bg-gray-800 shadow cursor-pointer transition"
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Navigation List */}
      <ul className="space-y-2">
        {menuItems.map(({ icon, label, onClick }, index) => (
          <li key={index} className={`w-full duration-300 rounded ${selectedMenu === label ? "bg-gray-800 text-gray-100 shadow-lg scale-105" : "hover:bg-gray-800 hover:scale-105 text-gray-100"}`}>
            <button
              onClick={() => onMenuSelect(label)}
              className="flex items-center gap-2 text-left py-4.5 px-1.5 rounded cursor-pointer w-full h-8 min-w-0 transition-all duration-200 text-gray-100 text-base"
            >
              <div className={`w-5 min-w-5 flex-shrink-0 text-gray-100`}>{icon}</div>
              <div className="overflow-hidden whitespace-nowrap min-w-0">
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="font-semibold drop-shadow text-gray-100 text-base"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* Question mark button at the bottom */}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={togglePopup}
          className="text-gray-100 p-2 rounded-full hover:bg-gray-800/30 cursor-pointer border border-gray-700 shadow"
        >
          <MessageCircleQuestion className="w-5 h-5" />
        </button>
      </div>

      {/* Popup with animation */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-900/95 bg-opacity-95 flex justify-center items-center z-50 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-gray-800 p-10 rounded-2xl text-gray-100 w-full max-w-lg shadow-2xl border-2 border-gray-700 flex flex-col items-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center mb-4">
                <MessageCircleQuestion className="w-12 h-12 text-gray-300 mb-2" />
                <h3 className="text-2xl font-bold mb-2">Welcome to <span className='text-blue-400'>StockGPT</span></h3>
                <p className="text-gray-300 text-center mb-4 max-w-md">
                  StockGPT is your AI-powered platform for intelligent stock market analysis. Choose from three powerful features:
                </p>
                <ul className="text-left text-gray-200 list-disc pl-6 space-y-1 mb-4">
                  <li><span className="font-semibold text-blue-300">StockGPT:</span> Get AI-recommended top 10 stocks with technical charts.</li>
                  <li><span className="font-semibold text-blue-300">Analyze:</span> View in-depth candlestick charts for any stock you search.</li>
                  <li><span className="font-semibold text-blue-300">Watchlist:</span> Save and track your favorite stocks for monitoring.</li>
                </ul>
              </div>
              <button
                onClick={togglePopup}
                className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded shadow-md font-semibold transition"
              >
                Close
              </button>
              <div className="mt-6 text-xs text-gray-400 text-center w-full border-t border-gray-700 pt-2">
                &copy; {new Date().getFullYear()} StockGPT. For research and educational use only.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default SideNav;
