import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPlay, FaInfoCircle, FaYoutube, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import { IMAGES } from '../../utils/constants';
import VideoPlayer from './VideoPlayer';
import { omdbService } from '../../services/omdbService';

const MovieCard = ({ movie, onClick }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
    const [trailerError, setTrailerError] = useState(null);

    useEffect(() => {
        if (movie.Poster && movie.Poster !== 'N/A') {
            const img = new Image();
            img.src = movie.Poster;
            img.onload = () => {
                setIsLoading(false);
                setImageLoaded(true);
            };
            img.onerror = () => {
                setImageError(true);
                setIsLoading(false);
            };
        } else {
            setIsLoading(false);
        }
    }, [movie.Poster]);

    const handlePlayClick = (e) => {
        e.stopPropagation();
        // Attempt to load trailer immediately for play functionality
        handleTrailerClick(e);
    };

    const handleInfoClick = (e) => {
        e.stopPropagation();
        if (onClick) {
            onClick(movie);
        } else {
            navigate(`/details/${movie.imdbID}`);
        }
    };

    const handleTrailerClick = async (e) => {
        e.stopPropagation();
        setIsLoadingTrailer(true);
        setTrailerError(null);

        try {
            const response = await omdbService.getTrailer(movie.Title, movie.Year, movie.Type);

            if (response.success && response.data) {
                setSelectedVideo(response.data);
            } else {
                setTrailerError(response.error || 'Failed to load trailer');
                console.error('Failed to find trailer:', response.error);
            }
        } catch (error) {
            setTrailerError('Error loading trailer');
            console.error('Error loading trailer:', error);
        } finally {
            setIsLoadingTrailer(false);
        }
    };

    const handleCardClick = () => {
        if (onClick) {
            onClick(movie);
        } else {
            navigate(`/details/${movie.imdbID}`);
        }
    };

    const hasValidPoster = movie.Poster && movie.Poster !== 'N/A' && !imageError;

    return (
        <>
            <div
                className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 group relative border border-gray-700/40"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleCardClick}
                role="button"
                aria-label={`View details for ${movie.Title}`}
                tabIndex={0}
            >
                {/* Year badge */}
                <div className="absolute top-2 right-2 z-10 bg-black/70 border border-gray-700 text-white text-xs px-2 py-1 rounded-full">
                    {movie.Year}
                </div>

                <div className="relative h-64">
                    {/* Skeleton loader */}
                    {isLoading && (
                        <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-600" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}

                    {hasValidPoster ? (
                        <>
                            <img
                                src={movie.Poster}
                                alt={movie.Title}
                                className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 brightness-50' : 'scale-100'}`}
                                loading="lazy"
                                style={{ opacity: imageLoaded ? 1 : 0 }}
                            />

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />

                            {/* Hover buttons and content */}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="mt-auto w-full">
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={handlePlayClick}
                                            className="w-full bg-white text-black py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-opacity-80 transition-colors text-sm font-medium"
                                        >
                                            <FaPlay className="text-red-600" /> Play
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleTrailerClick}
                                                disabled={isLoadingTrailer}
                                                className="flex-1 bg-red-600 text-white py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
                                            >
                                                <FaYoutube /> {isLoadingTrailer ? '...' : 'Trailer'}
                                            </button>
                                            <button
                                                onClick={handleInfoClick}
                                                className="flex-1 bg-gray-700 text-white py-2 px-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors text-sm font-medium"
                                            >
                                                <FaInfoCircle /> Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800 flex flex-col items-center justify-center p-4 text-center">
                            <svg className="w-12 h-12 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-white text-xs">No image available</p>
                        </div>
                    )}
                </div>

                {/* Card info - always visible, fixed at bottom */}
                <div className="p-3 border-t border-gray-700/50 bg-black/30">
                    <h3 className="text-white font-medium mb-1 line-clamp-1">{movie.Title}</h3>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-400 text-sm">{movie.Type}</p>
                        {movie.imdbRating && (
                            <span className="text-yellow-400 text-sm flex items-center">
                                <FaStar className="mr-1 text-xs" /> {movie.imdbRating}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <VideoPlayer
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                />
            )}

            {/* Error message */}
            {trailerError && !selectedVideo && isHovered && (
                <div className="absolute bottom-0 left-0 right-0 bg-red-600 text-white text-xs p-2 text-center">
                    {trailerError}
                </div>
            )}
        </>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        Title: PropTypes.string.isRequired,
        Year: PropTypes.string.isRequired,
        Poster: PropTypes.string,
        imdbRating: PropTypes.string,
        imdbID: PropTypes.string.isRequired,
        Type: PropTypes.string
    }).isRequired,
    onClick: PropTypes.func
};

export default MovieCard; 