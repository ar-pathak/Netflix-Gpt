import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaTimes, FaSpinner } from 'react-icons/fa';

// Popular search suggestions
const POPULAR_SEARCHES = ['marvel', 'star wars', 'avengers', 'batman', 'spider-man', 'lord of the rings', 'harry potter'];

const SearchForm = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsLoading(true);
            await onSearch(searchQuery);
            setIsLoading(false);
            inputRef.current?.blur();
            setShowSuggestions(false);
        }
    };
    
    const handleSuggestionClick = async (suggestion) => {
        setSearchQuery(suggestion);
        setIsLoading(true);
        await onSearch(suggestion);
        setIsLoading(false);
        setShowSuggestions(false);
    };
    
    const handleFocus = () => {
        setTimeout(() => setShowSuggestions(true), 200);
    };
    
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                inputRef.current && 
                !inputRef.current.contains(e.target) && 
                suggestionsRef.current && 
                !suggestionsRef.current.contains(e.target)
            ) {
                setShowSuggestions(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClearSearch = () => {
        setSearchQuery('');
        onSearch(''); // Clear search results
        inputRef.current?.focus();
    };

    return (
        <div className="mb-4 sm:mb-8 relative">
            <div className="max-w-3xl mx-auto px-2 sm:px-4">
                <form onSubmit={handleSubmit}>
                    <div className="relative shadow-lg">
                        <div className="flex flex-col sm:flex-row">
                            <div className="relative flex-grow">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for movies, shows, directors..."
                                    className="w-full px-3 sm:px-5 py-3 sm:py-4 pr-10 sm:pr-12 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow text-sm sm:text-lg"
                                    disabled={isLoading}
                                    onFocus={handleFocus}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        onClick={handleClearSearch}
                                        aria-label="Clear search"
                                    >
                                        <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className={`mt-2 sm:mt-0 px-4 sm:px-6 py-3 sm:py-4 bg-red-600 text-white rounded-lg sm:rounded-l-none sm:rounded-r-lg flex items-center justify-center min-w-[100px] sm:min-w-[120px] transition-all ${
                                    isLoading 
                                        ? 'opacity-75 cursor-not-allowed' 
                                        : 'hover:bg-red-700 hover:shadow-red-600/30 hover:shadow-lg'
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <FaSpinner className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                    <>
                                        <FaSearch className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                        <span className="text-sm sm:text-base">Search</span>
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {showSuggestions && POPULAR_SEARCHES.length > 0 && (
                            <div 
                                ref={suggestionsRef}
                                className="absolute z-10 mt-1 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 transform transition-all origin-top"
                            >
                                <div className="px-3 sm:px-4 py-2 text-xs text-gray-400 uppercase tracking-wider font-medium border-b border-gray-700">Popular searches</div>
                                <div className="max-h-48 sm:max-h-60 overflow-y-auto py-1">
                                    {POPULAR_SEARCHES.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="w-full text-left px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors flex items-center group"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <span className="mr-2 text-gray-400 group-hover:text-red-400">
                                                <FaSearch className="w-3 h-3 sm:w-4 sm:h-4" />
                                            </span>
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </form>
                
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-4 justify-center">
                    {POPULAR_SEARCHES.slice(0, 5).map((tag, index) => (
                        <button
                            key={index}
                            type="button"
                            className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gray-800 hover:bg-gray-700 text-xs sm:text-sm text-white rounded-full transition-all hover:scale-105"
                            onClick={() => handleSuggestionClick(tag)}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

SearchForm.propTypes = {
    onSearch: PropTypes.func.isRequired
};

export default SearchForm; 