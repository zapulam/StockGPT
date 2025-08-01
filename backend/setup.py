#!/usr/bin/env python3
"""
Setup script for StockGPT backend dependencies
"""

import subprocess
import sys
import os

def install_requirements():
    """Install all required packages"""
    print("Installing StockGPT backend dependencies...")
    
    try:
        # Install packages from requirements.txt
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All dependencies installed successfully!")
        
        # Check if config.yml exists
        if not os.path.exists("config.yml"):
            print("\n⚠️  Warning: config.yml not found!")
            print("Please create config.yml with your OpenAI API key:")
            print("""
openai:
  api_key: "your-openai-api-key-here"
  model: "gpt-4"

newsapi:
  api_key: "your-newsapi-key-here"  # Optional
            """)
        
        print("\n🚀 Backend setup complete!")
        print("Run: uvicorn api:app --reload --port 8000")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install dependencies: {e}")
        return False
    
    return True

if __name__ == "__main__":
    install_requirements()