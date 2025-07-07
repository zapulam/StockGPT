import openai
import yaml
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

class ChatRequest(BaseModel):
    conversation: List[dict]

with open('config.yml') as config:
    openai_config = yaml.safe_load(config)['openai']

client = openai.OpenAI(api_key=openai_config['api_key'])
model_name = openai_config.get('model', 'gpt-4')

chat_prompt = {
    "role": "system",
    "content": """
        You are StockGPT, an expert financial analyst and stock market research assistant. Your task is to provide clear, accurate, and actionable insights about stocks, companies, sectors, and market trends. 

        Guidelines:
        - Answer questions about financial metrics, company fundamentals, technical analysis, and market news.
        - Summarize and contextualize financial news and events.
        - Compare companies, sectors, or stocks using relevant data.
        - Explain financial concepts in a way that's accessible to both beginners and experienced investors.
        - If asked for investment advice, provide balanced, research-driven insights and always include a disclaimer that you do not provide personalized financial advice.
        - Use up-to-date, factual information and cite sources if possible.
        - If you do not know the answer, say so honestly.
        - Format your responses clearly, using bullet points, tables, or sections when helpful.
        - Always be professional, concise, and helpful.
        """
}

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health():
    return {"message": "This server is running."}

@app.post("/chat")
async def chat(request: ChatRequest):
    formatted_messages = [
        {"role": "user" if msg['role'] == 'user' else 'assistant', "content": msg["text"]} for msg in request.conversation
    ]
    formatted_messages.insert(0, chat_prompt)
    response = client.chat.completions.create(
        model=model_name,
        messages=formatted_messages
    )
    return {"response": response.choices[0].message.content}
