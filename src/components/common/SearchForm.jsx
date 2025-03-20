import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const POPULAR_SEARCHES = ['marvel', 'star wars', 'avengers', 'batman', 'spider-man', 'lord of the rings', 'harry potter'];

const SearchForm = ({ searchQuery, onSearchChange, onSubmit, isLoading }) => {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const suggestionsRef = useRef(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSubmit(searchQuery);
            inputRef.current?.blur();
            setShowSuggestions(false);
        }
    };
    
    const handleSuggestionClick = (suggestion) => {
        onSearchChange(suggestion);
        onSubmit(suggestion);
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

    return (
        <div className="mb-8 relative">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="relative shadow-lg">
                        <div className="flex">
                            <div className="relative flex-grow">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    placeholder="Search for movies, shows, directors..."
                                    className="w-full px-5 py-4 pr-12 rounded-l-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-shadow text-lg"
                                    disabled={isLoading}
                                    onFocus={handleFocus}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        onClick={() => onSearchChange('')}
                                        aria-label="Clear search"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className={`px-6 py-4 bg-red-600 text-white rounded-r-lg flex items-center justify-center min-w-[120px] transition-all ${
                                    isLoading 
                                        ? 'opacity-75 cursor-not-allowed' 
                                        : 'hover:bg-red-700 hover:shadow-red-600/30 hover:shadow-lg'
                                }`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        Search
                                    </>
                                )}
                            </button>
                        </div>
                        
                        {showSuggestions && POPULAR_SEARCHES.length > 0 && (
                            <div 
                                ref={suggestionsRef}
                                className="absolute z-10 mt-1 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 transform transition-all origin-top"
                            >
                                <div className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider font-medium border-b border-gray-700">Popular searches</div>
                                <div className="max-h-60 overflow-y-auto py-1">
                                    {POPULAR_SEARCHES.map((suggestion, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className="w-full text-left px-4 py-3 text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition-colors flex items-center group"
                                            onClick={() => handleSuggestionClick(suggestion)}
                                        >
                                            <span className="mr-2 text-gray-400 group-hover:text-red-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                                </svg>
                                            </span>
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </form>
                
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {POPULAR_SEARCHES.slice(0, 5).map((tag, index) => (
                        <button
                            key={index}
                            type="button"
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-white rounded-full transition-all hover:scale-105"
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
    searchQuery: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

export default SearchForm; 