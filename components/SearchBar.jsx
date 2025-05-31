'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiClock, FiFileText, FiExternalLink } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SearchBar = ({ onSearch, recentSearches = [], className = '' }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Mock search function - replace with actual API call
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock search results
      const mockResults = [
        {
          id: 1,
          title: 'Creating an Event',
          description: 'Learn how to create and publish your first event',
          url: '/help/events/creating-events',
          category: 'Events',
          type: 'guide'
        },
        {
          id: 2,
          title: 'Managing Tickets',
          description: 'How to manage and track ticket sales',
          url: '/help/events/managing-tickets',
          category: 'Events',
          type: 'guide'
        },
        {
          id: 3,
          title: 'Payment Setup',
          description: 'Configure payment methods and payout settings',
          url: '/help/finances/payment-setup',
          category: 'Finances',
          type: 'guide'
        },
        {
          id: 4,
          title: 'Team Management',
          description: 'Invite team members and set permissions',
          url: '/help/organization/team-management',
          category: 'Organization',
          type: 'guide'
        },
        {
          id: 5,
          title: 'Check-in & Scanning',
          description: 'Set up and manage event check-ins',
          url: '/help/orders-sales/checkin-scanning',
          category: 'Orders & Sales',
          type: 'guide'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(mockResults);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch?.(query);
      // Add to recent searches
      const updatedRecentSearches = [
        { query, timestamp: new Date() },
        ...recentSearches.filter(item => item.query !== query).slice(0, 4)
      ];
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowRecentSearches(true);
  };

  const handleBlur = () => {
    // Delay hiding to allow clicks on results
    setTimeout(() => {
      setIsFocused(false);
      setShowRecentSearches(false);
    }, 200);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
        setShowRecentSearches(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches);
        if (Array.isArray(parsed)) {
          // Update parent component's recentSearches if needed
          if (onSearch) {
            onSearch('', parsed);
          }
        }
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, [onSearch]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const ResultItem = ({ result }) => (
    <Link 
      href={result.url} 
      className="block p-3 hover:bg-gray-50 transition-colors rounded-md"
      onClick={() => setShowRecentSearches(false)}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {result.type === 'guide' ? (
            <FiFileText className="h-5 w-5 text-blue-500" />
          ) : (
            <FiExternalLink className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {result.title}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {result.description}
          </p>
          <div className="mt-1 flex items-center text-xs text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {result.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  const RecentSearchItem = ({ search, onSelect }) => (
    <button
      onClick={() => {
        setQuery(search.query);
        onSelect(search.query);
        setShowRecentSearches(false);
      }}
      className="w-full text-left p-2 hover:bg-gray-50 rounded-md flex items-center text-gray-700"
    >
      <FiClock className="h-4 w-4 text-gray-400 mr-2" />
      <span className="truncate">{search.query}</span>
    </button>
  );

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search help center..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-label="Search help center"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <FiX className="h-5 w-5 text-gray-400 hover:text-gray-500" />
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {(isFocused && (searchResults.length > 0 || showRecentSearches)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-96"
          >
            {query ? (
              <>
                {isLoading ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="h-2 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Search Results
                    </div>
                    {searchResults.map((result) => (
                      <ResultItem key={result.id} result={result} />
                    ))}
                    <div className="p-2 text-center text-sm text-blue-600 hover:bg-gray-50">
                      <Link href={`/help/search?q=${encodeURIComponent(query)}`}>
                        View all results for "{query}"
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No results found for "{query}"
                  </div>
                )}
              </>
            ) : showRecentSearches && recentSearches.length > 0 ? (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <RecentSearchItem
                    key={index}
                    search={search}
                    onSelect={(query) => {
                      setQuery(query);
                      onSearch?.(query);
                    }}
                  />
                ))}
                <div className="p-2 text-center text-sm text-gray-500 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      localStorage.removeItem('recentSearches');
                      onSearch?.('', []);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear recent searches
                  </button>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
