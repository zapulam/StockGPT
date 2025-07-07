import React, { useState } from "react";
import { Home, Files, PlusCircle, ChevronLeft, ChevronRight, MessageCircleQuestion, BarChart3, Filter, ListTodo } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SideNav = ({ onResetChat, selectedMenu, onMenuSelect }) => {
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
    { icon: <MessageCircleQuestion className="w-5 h-5" />, label: "LLM Chat" },
    { icon: <Files className="w-5 h-5" />, label: "News Insights" },
    { icon: <Home className="w-5 h-5" />, label: "Trending Stocks" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Analysis" },
    { icon: <ListTodo className="w-5 h-5" />, label: "Smart Watchlists" },
    { icon: <Filter className="w-5 h-5" />, label: "Stock Screener" },
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
          className="text-gray-100 p-1 rounded hover:bg-gray-800/30 cursor-pointer border border-gray-700"
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
              className="bg-gray-800 p-8 rounded-2xl text-gray-100 w-1/3 shadow-2xl border-2 border-gray-700"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-gray-100">Welcome to StockGPT</h3>
              <p className="mb-4">
                This app is an AI-powered toolkit for intelligent stock market analysis and research. Explore the features using the navigation menu!
              </p>
              <button
                onClick={togglePopup}
                className="mt-4 bg-gray-800 text-gray-100 p-2 rounded shadow-md hover:scale-105 transition"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default SideNav;
