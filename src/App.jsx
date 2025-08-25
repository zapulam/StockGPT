import React, { useState } from "react";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import StockGPT from "./components/StockGPT";
import Analyze from "./components/Analyze";
import Watchlist from "./components/Watchlist";
import { Sparkles, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function StockGPTApp() {
  const [selectedMenu, setSelectedMenu] = useState("StockGPT");
  const [isHelpPopupOpen, setIsHelpPopupOpen] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

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
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Sidebar */}
      <SideNav 
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
        onHelpClick={() => setIsHelpPopupOpen(true)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header />
        
        {/* Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {renderMainContent()}
          </div>
        </main>
      </div>

             {/* Help Popup - App Level */}
       {isHelpPopupOpen && (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50 p-4">
           <motion.div
             className="bg-white/5 backdrop-blur-2xl rounded-2xl p-8 w-full max-w-lg border border-white/20 shadow-2xl relative overflow-hidden"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9 }}
             transition={{ duration: 0.3, ease: "easeInOut" }}
           >
             {/* Glass effect overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-2xl"></div>
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-2xl"></div>
             
             {/* Content */}
             <div className="relative z-10">
               <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <Sparkles className="w-8 h-8 text-white" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-2">
                   Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">StockGPT</span>
                 </h3>
                 <p className="text-slate-300 text-sm leading-relaxed">
                   Your AI-powered platform for intelligent stock market analysis and insights.
                 </p>
               </div>

               <div className="space-y-4 mb-6 text-left">
                 {[
                   { 
                     icon: "🧠", 
                     label: "StockGPT",
                     description: "AI Recommendations",
                     color: "from-blue-500 to-purple-600"
                   },
                   { 
                     icon: "📈", 
                     label: "Analyze",
                     description: "Technical Analysis",
                     color: "from-emerald-500 to-teal-600"
                   },
                   { 
                     icon: "📋", 
                     label: "Watchlist",
                     description: "Track Stocks",
                     color: "from-orange-500 to-red-600"
                   },
                 ].map((item) => (
                   <div
                     key={item.label}
                     className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
                   >
                     <div className={`w-10 h-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                       {item.icon}
                     </div>
                     <div>
                       <div className="font-semibold text-white">{item.label}</div>
                       <div className="text-sm text-slate-400">{item.description}</div>
                     </div>
                   </div>
                 ))}
               </div>

               <button
                 onClick={() => setIsHelpPopupOpen(false)}
                 className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
               >
                 Got it!
               </button>

               <div className="mt-6 pt-4 border-t border-white/10 text-center">
                 <p className="text-xs text-slate-400">
                   &copy; {new Date().getFullYear()} StockGPT. For research and educational use only.
                 </p>
               </div>
             </div>
           </motion.div>
         </div>
       )}

       {/* Disclaimer Popup - Bottom Right */}
       {isDisclaimerOpen && (
         <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-end items-end z-50 p-4">
           <motion.div
             className="bg-white/5 backdrop-blur-2xl rounded-2xl p-6 w-full max-w-md border border-white/20 shadow-2xl relative overflow-hidden"
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.9, y: 20 }}
             transition={{ duration: 0.3, ease: "easeInOut" }}
           >
             {/* Glass effect overlay */}
             <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-white/10 rounded-2xl"></div>
             <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-orange-500/5 rounded-2xl"></div>
             
             {/* Content */}
             <div className="relative z-10 text-left">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                   <AlertTriangle className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-white">Important Disclaimer</h3>
                   <p className="text-slate-400 text-sm">Financial Information</p>
                 </div>
               </div>

               <div className="space-y-3 mb-6">
                 <p className="text-slate-300 text-sm leading-relaxed">
                   <strong>Disclaimer:</strong> AI recommendations and charts are for informational purposes only and should not be considered as financial advice.
                 </p>
                 <p className="text-slate-300 text-sm leading-relaxed">
                   Charts display real historical price data with technical indicators. Always conduct your own research and consult with financial professionals before making investment decisions.
                 </p>
                 <p className="text-slate-300 text-sm leading-relaxed">
                   <strong>Risk Warning:</strong> Investing in stocks involves risk, including the potential loss of principal. Past performance does not guarantee future results.
                 </p>
               </div>

               <button
                 onClick={() => setIsDisclaimerOpen(false)}
                 className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
               >
                 I Understand
               </button>

               <div className="mt-4 pt-3 border-t border-white/10 text-center">
                 <p className="text-xs text-slate-400">
                   &copy; {new Date().getFullYear()} StockGPT. For research and educational use only.
                 </p>
               </div>
             </div>
           </motion.div>
         </div>
       )}

       {/* Disclaimer Button - Bottom Right */}
       <motion.button
         onClick={() => setIsDisclaimerOpen(true)}
         className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-orange-500/20 to-red-600/20 hover:from-orange-500/30 hover:to-red-600/30 border border-white/10 transition-all duration-200 group cursor-pointer flex items-center justify-center z-40"
         whileHover={{ scale: 1.1 }}
         whileTap={{ scale: 0.9 }}
       >
         <AlertTriangle className="w-5 h-5 text-orange-400 group-hover:text-orange-300" />
       </motion.button>
    </div>
  );
}
