import React from 'react';
import { FaFilm, FaTv, FaStar, FaHistory, FaCompass } from 'react-icons/fa';
import SectionTitle from '../common/SectionTitle';

const ExploreSuggestions = ({ onExplore }) => {
    const suggestions = [
        {
            query: 'action',
            label: 'Action Movies',
            icon: <FaFilm className="text-3xl" />,
            gradient: 'from-red-600 to-red-800',
            description: 'High-octane thrillers and epic adventures'
        },
        {
            query: 'drama',
            label: 'Drama Series',
            icon: <FaTv className="text-3xl" />,
            gradient: 'from-blue-600 to-blue-800',
            description: 'Compelling stories and emotional journeys'
        },
        {
            query: 'top rated',
            label: 'Top Rated',
            icon: <FaStar className="text-3xl" />,
            gradient: 'from-yellow-600 to-yellow-800',
            description: 'Highest rated movies and shows'
        },
        {
            query: 'classic',
            label: 'Classic Films',
            icon: <FaHistory className="text-3xl" />,
            gradient: 'from-purple-600 to-purple-800',
            description: 'Timeless masterpieces and iconic cinema'
        }
    ];

    return (
        <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
                <SectionTitle>Explore More Categories</SectionTitle>
                <FaCompass className="text-2xl text-gray-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestions.map((suggestion) => (
                    <button
                        key={suggestion.query}
                        onClick={() => onExplore(suggestion.query)}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    >
                        {/* Background gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${suggestion.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                        
                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
                                {suggestion.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-100 transition-colors">
                                {suggestion.label}
                            </h3>
                            <p className="text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {suggestion.description}
                            </p>
                        </div>

                        {/* Hover effect border */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-xl transition-colors duration-300"></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ExploreSuggestions; 