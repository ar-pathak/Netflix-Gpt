import { useState, useEffect } from 'react';
import { omdbService } from '../services/omdbService';
import { getFallbackMovies } from '../utils/fallbackData';

const useUpcomingContent = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUpcomingContent = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch upcoming movies (using current year + 1)
                const currentYear = new Date().getFullYear();
                const nextYear = currentYear + 1;

                // Fetch movies from current year and next year
                const requests = [
                    omdbService.searchMovies('', { year: currentYear, type: 'movie' }),
                    omdbService.searchMovies('', { year: nextYear, type: 'movie' }),
                    omdbService.searchMovies('', { year: currentYear, type: 'series' }),
                    omdbService.searchMovies('', { year: nextYear, type: 'series' })
                ];

                const responses = await Promise.all(requests);
                let allResults = [];

                // Combine and process results
                responses.forEach(result => {
                    if (result.success && result.data) {
                        allResults = [...allResults, ...result.data];
                    }
                });

                // Sort by year and rating
                allResults.sort((a, b) => {
                    const yearA = parseInt(a.Year);
                    const yearB = parseInt(b.Year);
                    const ratingA = parseFloat(a.imdbRating) || 0;
                    const ratingB = parseFloat(b.imdbRating) || 0;

                    if (yearA !== yearB) {
                        return yearB - yearA;
                    }
                    return ratingB - ratingA;
                });

                // Take the top 20 results
                if (allResults.length > 0) {
                    setContent(allResults.slice(0, 20));
                } else {
                    setContent(getFallbackMovies('upcoming'));
                    console.warn('Using fallback upcoming content');
                }
            } catch (error) {
                console.error('Error loading upcoming content:', error);
                setError('Failed to load upcoming content');
                setContent(getFallbackMovies('upcoming'));
            } finally {
                setLoading(false);
            }
        };

        loadUpcomingContent();
    }, []);

    return { content, loading, error };
};

export default useUpcomingContent; 