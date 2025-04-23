import React, { useState, useEffect, useRef } from 'react';
import { FiSend, FiLoader, FiSearch, FiFilter, FiX, FiRefreshCw, FiHelpCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { omdbService } from '../../services/omdbService';

const AIRecommendations = ({ onMovieSelect }) => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m your AI movie assistant. I can help you discover movies based on your preferences. What kind of movies are you looking for?'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [filters, setFilters] = useState({
        type: 'movie',
        year: '',
        rating: '',
        genre: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [suggestions] = useState([
        "Recommend action movies from the 90s",
        "What are the best sci-fi movies of all time?",
        "I like The Matrix, what else should I watch?",
        "Show me some romantic comedies",
        "Find movies similar to Inception",
        "What are the highest rated movies this year?"
    ]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const parseQuery = (query) => {
        // Extract year if present
        const yearMatch = query.match(/\b(19\d{2}|20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : '';

        // Extract genre if present
        const genres = ['action', 'sci-fi', 'drama', 'comedy', 'horror', 'romance', 'thriller', 'adventure'];
        const genreMatch = genres.find(genre => query.toLowerCase().includes(genre));
        const genre = genreMatch || '';

        // Extract rating if present
        const ratingMatch = query.match(/\b(high|top|best)\b/i);
        const rating = ratingMatch ? '8.0' : '';

        // Extract type if present
        const typeMatch = query.match(/\b(movie|series|show)\b/i);
        const type = typeMatch ? (typeMatch[0] === 'series' || typeMatch[0] === 'show' ? 'series' : 'movie') : 'movie';

        return { year, genre, rating, type };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setSearchHistory(prev => [...prev, input]);
        setInput('');
        setIsLoading(true);

        try {
            // Parse the query for better search results
            const parsedQuery = parseQuery(input);
            
            // Enhanced search with parsed parameters
            const searchParams = {
                type: parsedQuery.type || filters.type,
                year: parsedQuery.year || filters.year,
                rating: parsedQuery.rating || filters.rating,
                genre: parsedQuery.genre || filters.genre
            };

            // If it's a "best of" query, search with high rating
            if (input.toLowerCase().includes('best') || input.toLowerCase().includes('top')) {
                searchParams.rating = '8.0';
            }

            // If it's a genre-specific query, use that genre
            if (parsedQuery.genre) {
                searchParams.genre = parsedQuery.genre;
            }

            // Perform multiple searches for better results
            const searchTerms = [
                input,
                parsedQuery.genre ? parsedQuery.genre : 'movie',
                'popular'
            ];

            const searchPromises = searchTerms.map(term => 
                omdbService.searchMovies(term, searchParams)
            );

            const results = await Promise.all(searchPromises);
            
            // Combine and deduplicate results
            const allResults = results
                .filter(result => result.success)
                .flatMap(result => result.data)
                .filter((movie, index, self) => 
                    index === self.findIndex(m => m.imdbID === movie.imdbID)
                )
                .sort((a, b) => {
                    const ratingA = parseFloat(a.imdbRating) || 0;
                    const ratingB = parseFloat(b.imdbRating) || 0;
                    return ratingB - ratingA;
                });

            if (allResults.length > 0) {
                setRecommendations(allResults.slice(0, 5));
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: `Here are some ${parsedQuery.type || 'movies'} based on your request:`
                }]);
            } else {
                // Fallback to popular movies if no results found
                const popularResult = await omdbService.searchMovies('popular', { type: 'movie' });
                if (popularResult.success) {
                    setRecommendations(popularResult.data.slice(0, 5));
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: 'Here are some popular movies you might enjoy:'
                    }]);
                } else {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: 'Sorry, I couldn\'t find any movies matching your request. Here are some popular movies instead:'
                    }]);
                }
            }
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error while searching for movies. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            type: 'movie',
            year: '',
            rating: '',
            genre: ''
        });
    };

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-gray-800 rounded-lg overflow-hidden shadow-xl"
        >
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">AI Movie Assistant</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                        <FiFilter />
                    </button>
                    <button
                        onClick={clearFilters}
                        className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                        <FiRefreshCw />
                    </button>
                </div>
            </div>

            {showFilters && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 border-b border-gray-700"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <select
                            value={filters.type}
                            onChange={(e) => handleFilterChange('type', e.target.value)}
                            className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="movie">Movie</option>
                            <option value="series">TV Series</option>
                            <option value="episode">Episode</option>
                        </select>
                        <input
                            type="text"
                            value={filters.year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            placeholder="Year"
                            className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={filters.rating}
                            onChange={(e) => handleFilterChange('rating', e.target.value)}
                            placeholder="Min Rating"
                            className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            value={filters.genre}
                            onChange={(e) => handleFilterChange('genre', e.target.value)}
                            placeholder="Genre"
                            className="bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </motion.div>
            )}

            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-700 text-gray-200'
                            }`}
                        >
                            {message.content}
                        </div>
                    </motion.div>
                ))}

                {recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex space-x-4 overflow-x-auto pb-4">
                            {recommendations.map((movie) => (
                                <motion.div
                                    key={movie.imdbID}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex-shrink-0 w-48 cursor-pointer"
                                    onClick={() => onMovieSelect(movie)}
                                >
                                    <div className="relative">
                                        <img
                                            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                                            alt={movie.Title}
                                            className="w-full h-72 object-cover rounded-lg"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                            <h3 className="text-white text-sm font-semibold truncate">{movie.Title}</h3>
                                            <p className="text-gray-300 text-xs">{movie.Year}</p>
                                            {movie.imdbRating && (
                                                <p className="text-yellow-400 text-xs">⭐ {movie.imdbRating}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-gray-700 rounded-lg p-3 text-gray-200">
                            <FiLoader className="animate-spin inline-block mr-2" />
                            Thinking...
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700">
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-sm bg-gray-700 text-gray-200 px-3 py-1 rounded-full hover:bg-gray-600 transition-colors"
                            >
                                {suggestion}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask for movie recommendations..."
                        className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiSend className="inline-block" />
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default AIRecommendations; 