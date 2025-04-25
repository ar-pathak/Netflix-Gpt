import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { FiSend, FiLoader, FiSearch, FiFilter, FiX, FiRefreshCw, FiHelpCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { AnimatePresence } from 'framer-motion';
import { omdbService } from '../../services/omdbService';
import { useDebounce } from '../../hooks/useDebounce';
import { useSearchHistory } from '../../hooks/useSearchHistory';

// Constants
const INITIAL_MESSAGE = {
    role: 'assistant',
    content: 'Hi! I\'m your AI movie assistant. I can help you discover movies based on your preferences. What kind of movies are you looking for?'
};

const DEFAULT_FILTERS = {
    type: 'movie',
    year: '',
    rating: '',
    genre: ''
};

const SUGGESTIONS = [
    "Recommend action movies from the 90s",
    "What are the best sci-fi movies of all time?",
    "I like The Matrix, what else should I watch?",
    "Show me some romantic comedies",
    "Find movies similar to Inception",
    "What are the highest rated movies this year?"
];

const AIRecommendations = ({ onMovieSelect }) => {
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [showFilters, setShowFilters] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const messagesEndRef = useRef(null);
    const { addToHistory } = useSearchHistory();
    const debouncedInput = useDebounce(input, 300);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const parseQuery = useCallback((query) => {
        const yearMatch = query.match(/\b(19\d{2}|20\d{2})\b/);
        const year = yearMatch ? yearMatch[0] : '';

        const genres = ['action', 'sci-fi', 'drama', 'comedy', 'horror', 'romance', 'thriller', 'adventure'];
        const genreMatch = genres.find(genre => query.toLowerCase().includes(genre));
        const genre = genreMatch || '';

        const ratingMatch = query.match(/\b(high|top|best)\b/i);
        const rating = ratingMatch ? '8.0' : '';

        const typeMatch = query.match(/\b(movie|series|show)\b/i);
        const type = typeMatch ? (typeMatch[0] === 'series' || typeMatch[0] === 'show' ? 'series' : 'movie') : 'movie';

        return { year, genre, rating, type };
    }, []);

    const getFranchiseSearchTerms = useCallback((query) => {
        const franchiseMap = {
            'marvel': ['marvel', 'mcu', 'avengers', 'iron man', 'captain america', 'thor', 'black panther'],
            'star wars': ['star wars', 'starwars', 'jedi', 'sith', 'skywalker'],
            'harry potter': ['harry potter', 'hogwarts', 'wizarding world'],
            'lord of the rings': ['lord of the rings', 'middle earth', 'hobbit'],
            'dc': ['dc', 'batman', 'superman', 'wonder woman', 'justice league'],
            'pixar': ['pixar', 'toy story', 'finding nemo', 'monsters inc'],
            'disney': ['disney', 'frozen', 'lion king', 'aladdin', 'beauty and the beast']
        };

        const lowerQuery = query.toLowerCase();
        for (const [, terms] of Object.entries(franchiseMap)) {
            if (terms.some(term => lowerQuery.includes(term))) {
                return terms;
            }
        }
        return null;
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        addToHistory(input);
        setInput('');
        setIsLoading(true);

        try {
            const parsedQuery = parseQuery(input);
            const searchParams = {
                type: parsedQuery.type || filters.type,
                year: parsedQuery.year || filters.year,
                rating: parsedQuery.rating || filters.rating,
                genre: parsedQuery.genre || filters.genre
            };

            if (input.toLowerCase().includes('best') || input.toLowerCase().includes('top')) {
                searchParams.rating = '8.0';
            }

            const franchiseTerms = getFranchiseSearchTerms(input);
            const searchTerms = franchiseTerms || [
                input,
                parsedQuery.genre ? parsedQuery.genre : 'movie',
                'popular'
            ];

            const searchPromises = searchTerms.map(term => 
                omdbService.searchMovies(term, searchParams)
            );

            const results = await Promise.all(searchPromises);
            
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
    }, [input, isLoading, filters, parseQuery, getFranchiseSearchTerms, addToHistory]);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
        setShowFilters(false);
        setMessages([INITIAL_MESSAGE]);
        setRecommendations([]);
    }, []);

    const handleSuggestionClick = useCallback((suggestion) => {
        setInput(suggestion);
    }, []);

    const filteredSuggestions = useMemo(() => {
        if (!debouncedInput) return SUGGESTIONS;
        return SUGGESTIONS.filter(suggestion => 
            suggestion.toLowerCase().includes(debouncedInput.toLowerCase())
        );
    }, [debouncedInput]);

    return (
        <div className="mb-12 bg-gray-800 rounded-lg overflow-hidden shadow-xl">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">AI Movie Assistant</h2>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                    >
                        {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
                    </button>
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

            <AnimatePresence>
                {!isCollapsed && (
                    <div className="transition-all duration-300 ease-in-out">
                        {showFilters && (
                            <div className="p-4 border-b border-gray-700">
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
                            </div>
                        )}

                        <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
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
                                </div>
                            ))}

                            {recommendations.length > 0 && (
                                <div className="space-y-4">
                                    <div className="flex space-x-4 overflow-x-auto pb-4">
                                        {recommendations.map((movie) => (
                                            <div
                                                key={movie.imdbID}
                                                className="flex-shrink-0 w-48 cursor-pointer transform transition-transform hover:scale-105"
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
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-700 rounded-lg p-3 text-gray-200">
                                        <FiLoader className="animate-spin inline-block mr-2" />
                                        Thinking...
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-700">
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {filteredSuggestions.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="text-sm bg-gray-700 text-gray-200 px-3 py-1 rounded-full hover:bg-gray-600 transition-colors"
                                        >
                                            {suggestion}
                                        </button>
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
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIRecommendations; 