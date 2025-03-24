import React from 'react';

const SectionTitle = ({ children }) => (
    <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{children}</h2>
        <div className="h-[1px] flex-grow ml-4 bg-gradient-to-r from-red-600 to-transparent"></div>
    </div>
);

export default SectionTitle; 