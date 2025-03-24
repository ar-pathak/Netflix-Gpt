import React from 'react';
import { FaArrowLeft, FaSpinner, FaSearch } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle';
import MovieCard from '../common/MovieCard';
import TypeFilter from './TypeFilter';
import Pagination from '../common/Pagination';

const SearchResults = ({
    searchQuery,
    searchResults,
    searchLoading,
    searchError,
    currentPage,
    totalPages,
    contentType,
    onBack,
    onMovieSelect,
    onPageChange,
    onTypeChange
}) => {
    const getContextTitle = () => {
        if (searchQuery.toLowerCase() === 'top rated') {
            return 'Top Rated Movies of All Time';
        }
        return `Search Results for "${searchQuery}"`;
    };

    return (
        <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center text-white bg-gray-800/80 hover:bg-gray-700/80 py-2.5 px-5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <FaArrowLeft className="mr-2" /> Back to Browse
                </button>
                <div className="text-center">
                    <SectionTitle>{getContextTitle()}</SectionTitle>
                    <p className="text-gray-400 mt-1">
                        {searchQuery.toLowerCase() === 'top rated' 
                            ? 'Curated list of highest-rated movies'
                            : `Found ${searchResults.length} results`}
                    </p>
                </div>
                <div className="w-32"></div> {/* Empty div for balance */}
            </div>

            {searchQuery.toLowerCase() !== 'top rated' && (
                <div className="bg-gray-800/50 rounded-xl p-4 mb-8 backdrop-blur-sm">
                    <TypeFilter activeType={contentType} onTypeChange={onTypeChange} />
                </div>
            )}

            {searchLoading ? (
                <div className="flex flex-col justify-center items-center h-64 space-y-4">
                    <FaSpinner className="animate-spin text-red-600 text-5xl" />
                    <p className="text-gray-400">Searching for movies...</p>
                </div>
            ) : searchError ? (
                <div className="text-center p-12 bg-gray-800/50 rounded-xl shadow-xl backdrop-blur-sm">
                    <div className="text-red-500 text-5xl mb-4">
                        <FaSearch />
                    </div>
                    <p className="text-red-500 text-xl mb-3">{searchError}</p>
                    <p className="text-gray-400">Try another search term or explore trending content below.</p>
                </div>
            ) : searchResults && searchResults.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {searchResults.map((movie) => (
                            <div key={movie.imdbID} className="transform transition-all duration-300 hover:-translate-y-1">
                                <MovieCard
                                    movie={movie}
                                    onClick={onMovieSelect}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={onPageChange}
                            isLoading={searchLoading}
                        />
                    </div>
                </>
            ) : (
                <div className="text-center p-12 bg-gray-800/50 rounded-xl shadow-xl backdrop-blur-sm">
                    <div className="text-gray-500 text-5xl mb-4">
                        <FaSearch />
                    </div>
                    <p className="text-gray-400 text-xl">No results found</p>
                    <p className="text-gray-500 mt-2">Try a different search term or explore our suggestions below.</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults; 