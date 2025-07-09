import openai
import yaml
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import requests

class ChatRequest(BaseModel):
    conversation: List[dict]

with open('config.yml') as config:
    config_data = yaml.safe_load(config)
    openai_config = config_data['openai']
    newsapi_key = config_data.get('newsapi', {}).get('api_key')

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

@app.get("/news")
async def get_news():
    # Fetch top finance/stock news from NewsAPI
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "category": "business",
        "language": "en",
        "pageSize": 10,
        "apiKey": newsapi_key
    }
    r = requests.get(url, params=params)
    articles = r.json().get("articles", [])
    results = []
    for article in articles:
        if not article.get("urlToImage") or not article.get("description"):
            continue
        # Summarize the article description using OpenAI
        summary_prompt = [
            {"role": "system", "content": "Summarize this news article for a finance/investing audience in 2-3 sentences."},
            {"role": "user", "content": article["description"]}
        ]
        try:
            summary_resp = client.chat.completions.create(
                model=model_name,
                messages=summary_prompt
            )
            summary = summary_resp.choices[0].message.content.strip()
        except Exception as e:
            summary = article["description"]
        results.append({
            "title": article["title"],
            "url": article["url"],
            "image": article["urlToImage"],
            "summary": summary,
            "source": article.get("source", {}).get("name", ""),
            "publishedAt": article.get("publishedAt", "")
        })
        if len(results) >= 15:
            break
    return {"news": results}

@app.get("/search-news")
async def search_news(query: str):
    # Search for articles with the given keyword using NewsAPI
    url = "https://newsapi.org/v2/everything"
    params = {
        "q": query,
        "language": "en",
        "sortBy": "publishedAt",
        "pageSize": 20,
        "apiKey": newsapi_key
    }
    r = requests.get(url, params=params)
    articles = r.json().get("articles", [])
    results = []
    for article in articles:
        if not article.get("urlToImage") or not article.get("description"):
            continue
        # Summarize the article description using OpenAI
        summary_prompt = [
            {"role": "system", "content": "Summarize this news article for a finance/investing audience in 2-3 sentences."},
            {"role": "user", "content": article["description"]}
        ]
        try:
            summary_resp = client.chat.completions.create(
                model=model_name,
                messages=summary_prompt
            )
            summary = summary_resp.choices[0].message.content.strip()
        except Exception as e:
            summary = article["description"]
        results.append({
            "title": article["title"],
            "url": article["url"],
            "image": article["urlToImage"],
            "summary": summary,
            "source": article.get("source", {}).get("name", ""),
            "publishedAt": article.get("publishedAt", "")
        })
        if len(results) >= 15:
            break
    return {"news": results}

@app.get("/news-sorted")
async def get_news_sorted(sort_by: str = "top"):
    # Fetch news from NewsAPI with different sorting options
    if sort_by == "popularity":
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": "finance OR stocks OR market",
            "language": "en",
            "sortBy": "popularity",
            "pageSize": 20,
            "apiKey": newsapi_key
        }
    elif sort_by == "recent":
        url = "https://newsapi.org/v2/everything"
        params = {
            "q": "finance OR stocks OR market",
            "language": "en",
            "sortBy": "publishedAt",
            "pageSize": 20,
            "apiKey": newsapi_key
        }
    else:  # default to top headlines
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "category": "business",
            "language": "en",
            "pageSize": 20,
            "apiKey": newsapi_key
        }
    
    r = requests.get(url, params=params)
    articles = r.json().get("articles", [])
    results = []
    for article in articles:
        if not article.get("urlToImage") or not article.get("description"):
            continue
        # Summarize the article description using OpenAI
        summary_prompt = [
            {"role": "system", "content": "Summarize this news article for a finance/investing audience in 2-3 sentences."},
            {"role": "user", "content": article["description"]}
        ]
        try:
            summary_resp = client.chat.completions.create(
                model=model_name,
                messages=summary_prompt
            )
            summary = summary_resp.choices[0].message.content.strip()
        except Exception as e:
            summary = article["description"]
        results.append({
            "title": article["title"],
            "url": article["url"],
            "image": article["urlToImage"],
            "summary": summary,
            "source": article.get("source", {}).get("name", ""),
            "publishedAt": article.get("publishedAt", "")
        })
        if len(results) >= 15:
            break
    return {"news": results}
