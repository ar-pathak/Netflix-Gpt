import { useState, useCallback } from 'react';
import { omdbService } from '../services/omdbService';

const TOP_RATED_MOVIES = [
    'The Shawshank Redemption',
    'The Godfather',
    'The Dark Knight',
    'The Godfather Part II',
    '12 Angry Men',
    'Schindler\'s List',
    'The Lord of the Rings: The Return of the King',
    'Pulp Fiction',
    'The Lord of the Rings: The Fellowship of the Ring',
    'The Good, the Bad and the Ugly'
];

export const useMovieSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [contentType, setContentType] = useState('');

    const handleSearch = useCallback(async (query) => {
        if (!query) {
            setSearchResults([]);
            setTotalPages(0);
            setSearchQuery('');
            return;
        }

        setSearchLoading(true);
        setSearchError(null);
        setSearchQuery(query);

        try {
            // Special handling for "top rated" search
            if (query.toLowerCase() === 'top rated') {
                const requests = TOP_RATED_MOVIES.map(title => 
                    omdbService.searchMovies(title, { type: 'movie' })
                );

                const responses = await Promise.all(requests);
                let allResults = [];
                
                responses.forEach(result => {
                    if (result.success && result.data && result.data.length > 0) {
                        allResults.push(result.data[0]);
                    }
                });

                // Sort by IMDb rating if available
                allResults.sort((a, b) => {
                    const ratingA = parseFloat(a.imdbRating) || 0;
                    const ratingB = parseFloat(b.imdbRating) || 0;
                    return ratingB - ratingA;
                });

                setSearchResults(allResults);
                setTotalPages(1);
            } else {
                const resultsPerPage = 26;
                const numRequests = 3;
                const startPage = (currentPage - 1) * numRequests + 1;

                let allResults = [];
                let totalFound = 0;

                const requests = [];
                for (let i = 0; i < numRequests; i++) {
                    requests.push(
                        omdbService.searchMovies(query, {
                            page: startPage + i,
                            type: contentType
                        })
                    );
                }

                const responses = await Promise.all(requests);

                responses.forEach(result => {
                    if (result.success) {
                        allResults = [...allResults, ...result.data];
                        if (totalFound === 0 && result.totalResults) {
                            totalFound = result.totalResults;
                        }
                    }
                });

                if (allResults.length > 0) {
                    setSearchResults(allResults);
                    setTotalPages(Math.ceil(totalFound / resultsPerPage));
                } else {
                    setSearchResults([]);
                    setTotalPages(0);

                    if (responses.every(r => !r.success)) {
                        setSearchError(responses[0].error);
                    }
                }
            }
        } catch (error) {
            console.error('Error searching movies:', error);
            setSearchError('Failed to search movies');
            setSearchResults([]);
            setTotalPages(0);
        } finally {
            setSearchLoading(false);
        }
    }, [currentPage, contentType]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleTypeChange = (type) => {
        setContentType(type);
        setCurrentPage(1);
    };

    const resetSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setTotalPages(0);
    };

    return {
        searchQuery,
        searchResults,
        searchLoading,
        searchError,
        currentPage,
        totalPages,
        contentType,
        handleSearch,
        handlePageChange,
        handleTypeChange,
        resetSearch
    };
}; 