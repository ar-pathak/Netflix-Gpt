import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
    if (totalPages <= 1) return null;

    // Calculate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        if (totalPages <= 5) {
            // Show all pages if 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Show ellipsis if not on first few pages
            if (currentPage > 3) {
                pages.push('...');
            }

            // Calculate start and end of middle pages
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near beginning or end
            if (currentPage <= 3) {
                endPage = 4;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Show ellipsis if not near last page
            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            // Always show last page
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="mt-8 mb-6">
            <div className="flex justify-center items-center flex-wrap gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
                    className={`flex items-center justify-center h-10 px-4 rounded-lg transition-colors ${
                        currentPage <= 1 || isLoading
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    aria-label="Previous page"
                >
                    <FaArrowLeft size={16} className="mr-2" /> Previous
                </button>

                <div className="hidden md:flex items-center space-x-1">
                    {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                            {page === '...' ? (
                                <span className="text-gray-400 px-2">...</span>
                            ) : (
                                <button
                                    onClick={() => onPageChange(page)}
                                    disabled={isLoading}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                                        currentPage === page
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-800 text-white hover:bg-gray-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flex md:hidden items-center bg-gray-800 px-4 py-2 rounded-lg">
                    <span className="text-gray-300 mr-1">Page</span>
                    <span className="text-white font-medium">{currentPage}</span>
                    <span className="text-gray-300 mx-1">of</span>
                    <span className="text-white font-medium">{totalPages}</span>
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
                    className={`flex items-center justify-center h-10 px-4 rounded-lg transition-colors ${
                        currentPage >= totalPages || isLoading
                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                    aria-label="Next page"
                >
                    Next <FaArrowRight size={16} className="ml-2" />
                </button>
            </div>

            <div className="text-center mt-4 text-gray-400 text-sm">
                Showing results {Math.min((currentPage - 1) * 24 + 1, totalPages * 24)}
                - {Math.min(currentPage * 24, totalPages * 24)}
                {totalPages > 0 ? ` of ${totalPages * 24}` : ''}
            </div>
        </div>
    );
};

export default Pagination; 