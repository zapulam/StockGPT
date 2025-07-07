import React, { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Header from "./components/Header";
import SideNav from "./components/SideNav";
import NewsInsights from "./components/NewsInsights";
import TrendingStocks from "./components/TrendingStocks";
import LLMChat from "./components/LLMChat";
import FundamentalTechnicalAnalysis from "./components/FundamentalTechnicalAnalysis";
import SmartWatchlists from "./components/SmartWatchlists";
import AIAugmentedStockScreener from "./components/AIAugmentedStockScreener";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [images, setImages] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("LLM Chat");

  const handleImageUpload = (updatedFiles) => {
    // Ensure updatedFiles is an array of File objects
    if (!Array.isArray(updatedFiles)) {
      console.error('Expected updatedFiles to be an array, but got:', updatedFiles);
      return;
    }
  
    const base64Images = updatedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
      });
    });
  
    // Once all files are read as base64, update the images state
    Promise.all(base64Images).then((base64Images) => {
      setImages(base64Images); // Set base64 images in state
    });
  };
  
  
  const handleStartChat = async (selectedFiles, initialMessage) => {
    setChatStarted(true);
    const newMessages = [];
  
    if (selectedFiles.length > 0) {
      // Convert files to base64 before adding to images state
      const base64Images = await Promise.all(
        selectedFiles.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      );
  
      // Only update images if it's a new set of base64-encoded images
      setImages((prevImages) => {
        const uniqueBase64Images = base64Images.filter((img) => !prevImages.includes(img));
        return [...prevImages, ...uniqueBase64Images];
      });
    }
  
    if (initialMessage.trim()) {
      newMessages.push({ text: initialMessage, role: "user" });
    }
  
    const updatedMessages = [...messages, ...newMessages];
  
    if (newMessages.length > 0) {
      setMessages(updatedMessages); // Update chat history
      try {
        console.log("Sending conversation to API:", updatedMessages);
  
        // Call API to get LLM response
        const response = await fetch("http://127.0.0.1:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation: updatedMessages,
            images: images
          }),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Failed to get response");
  
        setMessages((prev) => [...prev, { text: data.response, role: "assistant" }]);
  
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [...prev, { text: "Error: Unable to get response.", role: "assistant" }]);
      }
    }
  };
  

  const sendMessage = async () => {
    if (!input.trim() && images.length === 0) return; // Ensure we have either text or images

    const userMessage = { text: input, role: "user" };

    // Update chat history before making API call
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput(""); // Clear input field

    try {
        const response = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                conversation: updatedMessages,
                images: images
            }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Failed to get response");

        // Add assistant response to chat
        const botResponse = { text: data.response, role: "assistant" };
        setMessages((prev) => [...prev, botResponse]);
        //setImages([]); // Clear images after sending

    } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [...prev, { text: "Error: Unable to get response.", role: "assistant" }]);
    }
  };


  const resetChat = () => {
    setMessages([]);
    setImages([]);
    setInput("");
    setChatStarted(false);
  };

  // Helper to render the selected feature component
  const renderMainContent = () => {
    switch (selectedMenu) {
      case "News Insights":
        return <NewsInsights />;
      case "Trending Stocks":
        return <TrendingStocks />;
      case "LLM Chat":
        return <LLMChat />;
      case "Fundamental & Technical Analysis":
        return <FundamentalTechnicalAnalysis />;
      case "Smart Watchlists":
        return <SmartWatchlists />;
      case "AI Augmented Stock Screener":
        return <AIAugmentedStockScreener />;
      default:
        return <NewsInsights />;
    }
  };

  return (
    <div className="flex flex-row w-screen h-screen items-center min-h-screen">
      <SideNav 
        onResetChat={resetChat} 
        selectedMenu={selectedMenu}
        onMenuSelect={setSelectedMenu}
      />
      <div className="h-full w-full flex flex-col justify-between bg-gray-900 overflow-hidden">
        <Header />
        <div className="flex flex-col grow shadow-lg overflow-hidden bg-gray-900 p-8 rounded-xl m-6">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
