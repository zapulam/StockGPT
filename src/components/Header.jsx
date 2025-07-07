// src/components/Header.jsx
import React from "react";
import { Settings, User, ChartArea  } from "lucide-react";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header
      className="w-full h-sm text-gray-100 p-4 text-2xl font-bold flex justify-between items-center bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg border-b-2 border-gray-700"
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        <ChartArea className="w-7 h-7 drop-shadow-lg text-gray-100" />
        <span className="bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">StockGPT</span>
      </div>
      <div className="flex gap-4">
        <button className="p-2 rounded-full hover:bg-gray-700 bg-gray-800 shadow-md border border-gray-700 transition duration-300 cursor-pointer">
          <Settings className="w-4 h-4 md:w-6 md:h-6 text-gray-100 drop-shadow" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-700 bg-gray-800 shadow-md border border-gray-700 transition duration-300 cursor-pointer">
          <User className="w-4 h-4 md:w-6 md:h-6 text-gray-100 drop-shadow" />
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
