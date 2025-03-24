import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaCircle, FaRegCircle } from 'react-icons/fa';

const Carousel = ({ items, renderItem, autoPlay = false, interval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const carouselRef = useRef(null);

    useEffect(() => {
        let intervalId;
        if (autoPlay && !isHovered) {
            intervalId = setInterval(() => {
                goToNext();
            }, interval);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [autoPlay, interval, isHovered]);

    const goToPrevious = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? items.length - 1 : prevIndex - 1));
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const goToNext = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex((prevIndex) => (prevIndex === items.length - 1 ? 0 : prevIndex + 1));
        setTimeout(() => setIsTransitioning(false), 500);
    };

    const goToSlide = (index) => {
        if (isTransitioning || index === currentIndex) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 500);
    };

    return (
        <div
            className="relative w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main carousel area */}
            <div
                ref={carouselRef}
                className="relative flex transition-transform duration-500 ease-out"
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                    transition: isTransitioning ? 'transform 500ms ease-out' : 'none'
                }}
            >
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="w-full flex-shrink-0"
                    >
                        {renderItem(item)}
                    </div>
                ))}
            </div>

            {/* Navigation buttons */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Previous slide"
            >
                <FaChevronLeft className="text-xl" />
            </button>
            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Next slide"
            >
                <FaChevronRight className="text-xl" />
            </button>

            {/* Dots navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className="focus:outline-none transition-transform duration-300 hover:scale-110"
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        {index === currentIndex ? (
                            <FaCircle className="text-white text-sm" />
                        ) : (
                            <FaRegCircle className="text-white/50 hover:text-white/70 text-sm" />
                        )}
                    </button>
                ))}
            </div>

            {/* Gradient overlays */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/50 to-transparent pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/50 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default Carousel; 