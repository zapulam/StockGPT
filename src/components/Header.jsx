// src/components/Header.jsx
import React from "react";
import { Settings, User, ChartArea, Bell, Search } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      className="relative w-full h-16 px-6 flex justify-between items-center bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Left side - Logo and Brand */}
      <div className="flex items-center gap-3">
        <motion.div
          className="relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <ChartArea className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20"></div>
        </motion.div>
        
        <div className="flex flex-col">
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            StockGPT
          </h1>
          <p className="text-xs text-slate-400 -mt-1">AI-Powered Analysis</p>
        </div>
      </div>

      {/* Center - Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stocks, news, or analysis..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all duration-200"
          />
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <motion.button
          className="relative p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </motion.button>

        {/* Settings */}
        <motion.button
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
        </motion.button>

        {/* User Profile */}
        <motion.button
          className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/10 transition-all duration-200 group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-white hidden lg:block">Account</span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
