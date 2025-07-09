import React, { useEffect, useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";

const NewsInsights = () => {
  const [news, setNews] = useState([]);
  const [allNews, setAllNews] = useState([]); // Store all fetched news
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(6); // Show 6 articles initially
  const [searchLoading, setSearchLoading] = useState(false);
  const [sortBy, setSortBy] = useState("top"); // top, popularity, recent
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const sortOptions = [
    { value: "top", label: "Top" },
    { value: "popularity", label: "Most Popular" },
    { value: "recent", label: "Most Recent" }
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortBy);
    return option ? option.label : "Top";
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const fetchNews = async (sortType = "top") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/news-sorted?sort_by=${sortType}`);
      if (!response.ok) throw new Error("Failed to fetch news");
      const data = await response.json();
      const newsData = data.news || [];
      setAllNews(newsData);
      setNews(newsData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if we have cached news data
    const cachedNews = localStorage.getItem('stockgpt_news');
    const cachedTimestamp = localStorage.getItem('stockgpt_news_timestamp');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    // Use cached data if it exists and is less than 1 hour old
    if (cachedNews && cachedTimestamp && (now - parseInt(cachedTimestamp)) < oneHour) {
      try {
        const newsData = JSON.parse(cachedNews);
        setAllNews(newsData);
        setNews(newsData);
        setLoading(false);
        return;
      } catch (e) {
        // If parsing fails, clear cache and fetch fresh data
        localStorage.removeItem('stockgpt_news');
        localStorage.removeItem('stockgpt_news_timestamp');
      }
    }

    // Fetch fresh data
    fetchNews("top");
  }, []);

  // Search functionality with debouncing
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // Only set to allNews if allNews has content and we're not in a loading state
      if (allNews.length > 0 && !loading) {
        setNews(allNews);
        setDisplayCount(6);
      }
      return;
    }

    const timeoutId = setTimeout(() => {
      setSearchLoading(true);
      fetch(`http://127.0.0.1:8000/search-news?query=${encodeURIComponent(searchTerm)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to search news");
          return res.json();
        })
        .then((data) => {
          const searchResults = data.news || [];
          setNews(searchResults);
          setDisplayCount(6);
          setSearchLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setSearchLoading(false);
        });
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm, allNews, loading]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setSearchTerm(""); // Clear search when changing sort
    setDropdownOpen(false); // Close dropdown
    fetchNews(newSortBy);
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 6);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (!allNews.length && !loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-gray-400 text-xl">No news found.</div>
      </div>
    );
  }

  const displayedNews = news.slice(0, displayCount);
  const hasMore = displayedNews.length < news.length;

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      <div className="flex flex-col items-center w-full p-4">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">News Insights</h1>
        
        {/* Search and Sort Controls */}
        <div className="w-full max-w-4xl mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative flex items-center justify-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 hover:bg-gray-700 transition-colors min-w-[160px]"
              >
                <ChevronDown className={`absolute left-3 w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                <span>{getCurrentSortLabel()}</span>
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                        sortBy === option.value ? 'text-blue-400 bg-gray-700' : 'text-gray-100'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading indicator for search */}
        {searchLoading && searchTerm && (
          <div className="text-gray-400 mb-4 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Searching...
          </div>
        )}

        {/* Loading indicator for sort changes */}
        {loading && (
          <div className="text-gray-300 mb-4 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading news...
          </div>
        )}

        {/* Results count */}
        {searchTerm && !searchLoading && (
          <div className="text-gray-400 mb-4">
            Found {news.length} article{news.length !== 1 ? 's' : ''} for "{searchTerm}"
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            {displayedNews.map((article, idx) => (
              <a
                key={idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 flex flex-col hover:scale-[1.02] transition-transform duration-200 group"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700 group-hover:opacity-90"
                />
                <div className="flex-1 flex flex-col">
                  <h2 className="text-xl font-semibold text-gray-100 mb-2">{article.title}</h2>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-gray-400 text-sm">{article.source}</div>
                    <div className="text-gray-500 text-xs">{formatTimestamp(article.publishedAt)}</div>
                  </div>
                  <p className="text-gray-200 mb-2">{article.summary}</p>
                </div>
                <span className="text-blue-400 text-xs mt-2">Read more &rarr;</span>
              </a>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !loading && (
          <div className="mt-8">
            <button
              onClick={loadMore}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
            >
              Load More Articles
            </button>
          </div>
        )}

        {/* No results message */}
        {searchTerm && !searchLoading && news.length === 0 && (
          <div className="text-gray-400 text-center mt-8">
            No articles found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsInsights; 