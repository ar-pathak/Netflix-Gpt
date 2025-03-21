import React, { useRef, useEffect } from 'react';
import { FaTimes, FaYoutube, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';

const VideoPlayer = ({ video, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    // Add event listener to close modal on ESC key
    const handleEscClose = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Add event listener to close on click outside
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscClose);
    document.addEventListener('mousedown', handleClickOutside);

    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscClose);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!video) return null;

  // Check if this is a direct search type
  const isDirectSearch = video.key.startsWith('direct_search:');
  
  // Create YouTube search URL for direct linking
  const searchQuery = isDirectSearch 
    ? video.key.split('direct_search:')[1] 
    : '';
  
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;

  // For embedded video, we use a different approach
  const isCustomEmbed = video.key.startsWith('videosearch');
  
  // Fix the YouTube embed URL format
  let youtubeEmbedUrl;
  if (isCustomEmbed) {
    // Extract the query parameter
    const queryParam = video.key.split('q=')[1];
    // Create a direct search-based YouTube embed URL
    youtubeEmbedUrl = `https://www.youtube.com/embed?listType=search&list=${queryParam}&autoplay=1`;
  } else if (!isDirectSearch) {
    // Direct video embed
    youtubeEmbedUrl = `https://www.youtube.com/embed/${video.key}?autoplay=1`;
  }

  // Handle direct link to YouTube function
  const openYouTubeSearch = () => {
    window.open(youtubeSearchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm">
      <div ref={modalRef} className="relative w-full max-w-4xl mx-4 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
        {/* Top controls with back button and close button */}
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <button
            onClick={onClose}
            className="flex items-center bg-black bg-opacity-70 hover:bg-opacity-90 text-white px-4 py-2 rounded-full transition-colors"
            aria-label="Back to browsing"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
          
          <button
            onClick={onClose}
            className="bg-black bg-opacity-70 hover:bg-opacity-90 text-white rounded-full p-2 transition-colors"
            aria-label="Close trailer"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Video container or direct search option */}
        {isDirectSearch ? (
          <div className="p-8 bg-gray-900 text-center">
            <FaYoutube className="w-20 h-20 text-red-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-4">{video.name}</h3>
            <p className="text-gray-400 mb-6">
              The trailer can be viewed directly on YouTube
            </p>
            <button 
              onClick={openYouTubeSearch}
              className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg transition-colors"
            >
              <FaExternalLinkAlt className="mr-2" />
              Open on YouTube
            </button>
          </div>
        ) : (
          <>
            <div className="relative pt-[56.25%] bg-black">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={youtubeEmbedUrl}
                title={video.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Video info */}
            <div className="p-4 bg-gray-900 text-white">
              <h3 className="text-xl font-semibold">{video.name}</h3>
              <p className="text-sm text-gray-400">{video.type}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer; 