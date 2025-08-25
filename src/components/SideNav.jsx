import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircleQuestion, Brain, TrendingUp, BookmarkPlus, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SideNav = ({ selectedMenu, onMenuSelect, onHelpClick }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleHelpClick = () => {
    onHelpClick();
    // Expand the sidebar when help is clicked so text fits
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const menuItems = [
    { 
      icon: <Brain className="w-5 h-5" />, 
      label: "StockGPT",
      description: "AI Recommendations",
      color: "from-blue-500 to-purple-600"
    },
    { 
      icon: <TrendingUp className="w-5 h-5" />, 
      label: "Analyze",
      description: "Technical Analysis",
      color: "from-emerald-500 to-teal-600"
    },
    { 
      icon: <BookmarkPlus className="w-5 h-5" />, 
      label: "Watchlist",
      description: "Track Stocks",
      color: "from-orange-500 to-red-600"
    },
  ];

  return (
    <motion.aside
      className="relative h-full bg-white/5 backdrop-blur-xl border-r border-white/10"
      animate={{ width: isCollapsed ? 68 : 268 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="h-20 flex items-center px-4 border-b border-white/10">
        <motion.button
          onClick={handleToggle}
          className="w-11 h-11 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200 flex items-center justify-center flex-shrink-0 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-slate-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-slate-300" />
          )}
        </motion.button>
        
        {!isCollapsed && (
          <div className="flex-1 text-left ml-3 min-w-0">
            <h2 className="text-lg font-bold text-white truncate">Navigation</h2>
            <p className="text-xs text-slate-400 truncate">Quick Access</p>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <nav className="p-4 space-y-2">
        {menuItems.map(({ icon, label, description, color }) => (
          <button
            key={label}
            onClick={() => onMenuSelect(label)}
            className={`w-full group relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer h-16 ${
              selectedMenu === label 
                ? 'bg-gradient-to-r ' + color + ' shadow-lg' 
                : 'hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
          >
            <div className="flex items-center h-full px-3">
              {/* Icon - no box, just the icon */}
              <div className={`transition-colors duration-300 ${
                selectedMenu === label 
                  ? 'text-white' 
                  : 'text-slate-300 group-hover:text-white'
              }`}>
                {icon}
              </div>
              
              {/* Text content */}
              {!isCollapsed && (
                <div className="flex-1 text-left ml-3 min-w-0">
                  <div className={`font-semibold transition-colors truncate ${
                    selectedMenu === label ? 'text-white' : 'text-slate-200 group-hover:text-white'
                  }`}>
                    {label}
                  </div>
                  <div className={`text-xs transition-colors truncate ${
                    selectedMenu === label ? 'text-white/80' : 'text-slate-300 group-hover:text-slate-300'
                  }`}>
                    {description}
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </nav>

      {/* Help Button */}
      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={handleHelpClick}
          className="w-12 h-12 rounded-full bg-gradient-to-r from-slate-600/20 to-slate-700/20 hover:from-slate-600/30 hover:to-slate-700/30 border border-white/10 transition-all duration-200 group cursor-pointer flex items-center justify-center"
        >
          <MessageCircleQuestion className="w-5 h-5 text-slate-300 group-hover:text-white" />
        </button>
      </div>

      
    </motion.aside>
  );
};

export default SideNav;
