import { useState, useEffect } from 'react';

const SEARCH_HISTORY_KEY = 'movie_search_history';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const addToHistory = (query) => {
        if (!query.trim()) return;

        setHistory(prev => {
            const newHistory = [
                query,
                ...prev.filter(item => item.toLowerCase() !== query.toLowerCase())
            ].slice(0, MAX_HISTORY_ITEMS);

            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
            return newHistory;
        });
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem(SEARCH_HISTORY_KEY);
    };

    return {
        history,
        addToHistory,
        clearHistory
    };
}; 