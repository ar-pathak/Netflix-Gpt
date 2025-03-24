import React from 'react';

const TypeFilter = ({ activeType, onTypeChange }) => {
    const types = [
        { id: '', label: 'All' },
        { id: 'movie', label: 'Movies' },
        { id: 'series', label: 'TV Shows' },
        { id: 'episode', label: 'Episodes' }
    ];

    return (
        <div className="flex justify-center mb-6 bg-gray-850 rounded-lg p-1">
            <div className="flex space-x-1">
                {types.map((type) => (
                    <button
                        key={type.id}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeType === type.id
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                        }`}
                        onClick={() => onTypeChange(type.id)}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TypeFilter; 