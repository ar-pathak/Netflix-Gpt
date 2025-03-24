import { useState, useEffect } from 'react';
import { omdbService } from '../services/omdbService';
import { getFallbackMovies } from '../utils/fallbackData';

export const useContent = (searchTerm, type = 'movie') => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);

            try {
                const result1 = await omdbService.searchMovies(searchTerm, { type });
                const result2 = await omdbService.searchMovies(searchTerm, { type, page: 2 });

                let combinedResults = [];

                if (result1.success && result1.data && result1.data.length > 0) {
                    combinedResults = [...result1.data];
                }

                if (result2.success && result2.data && result2.data.length > 0) {
                    combinedResults = [...combinedResults, ...result2.data];
                }

                if (combinedResults.length > 0) {
                    setContent(combinedResults.slice(0, 17));
                } else {
                    setContent(getFallbackMovies(searchTerm === 'marvel' ? 'trending' : 'popular'));
                    console.warn(`Using fallback ${searchTerm === 'marvel' ? 'trending' : 'popular'} content`);
                }
            } catch (error) {
                console.error(`Error loading ${searchTerm} content:`, error);
                setError(`Failed to load ${searchTerm} content`);
                setContent(getFallbackMovies(searchTerm === 'marvel' ? 'trending' : 'popular'));
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [searchTerm, type]);

    return { content, loading, error };
}; 