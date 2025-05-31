'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Feedback from './Feedback';

const HelpCenterLayout = ({ children, title, description }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle search functionality
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // In a real app, you would call your search API here
      // const results = await searchHelpArticles(searchQuery);
      // setSearchResults(results);
      
      // For demo purposes, we'll simulate a search
      setTimeout(() => {
        setSearchResults([
          { id: 1, title: 'Getting Started', url: '/help-center/getting-started' },
          { id: 2, title: 'Creating Events', url: '/help-center/events/creating-events' },
          { id: 3, title: 'Managing Team Members', url: '/help-center/organization/team-management' },
        ]);
        setIsSearching(false);
      }, 500);
    } catch (error) {
      console.error('Search failed:', error);
      setIsSearching(false);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('.search-container') === null) {
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title ? `${title} | Help Center` : 'Help Center'}</title>
        <meta name="description" content={description || 'Help center documentation'} />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="md:hidden mr-4"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <Link href="/help-center" className="text-xl font-bold text-gray-900">
                Help Center
              </Link>
            </div>
            
            <div className="relative search-container w-full max-w-xl">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search help articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </form>
              
              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-96">
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.url}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setSearchResults([])}
                    >
                      {result.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className={`${isMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 mb-8 md:mb-0 md:mr-8`}>
            <nav className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Getting Started
              </h3>
              <Link href="/help-center/getting-started" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <span className="truncate">Getting Started</span>
              </Link>
              
              <h3 className="px-3 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Events
              </h3>
              <Link href="/help-center/events/creating-events" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <span className="truncate">Creating Events</span>
              </Link>
              
              <h3 className="px-3 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Organization
              </h3>
              <Link href="/help-center/organization/team-management" className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                <span className="truncate">Team Management</span>
              </Link>
              
              {/* Add more navigation items as needed */}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="prose max-w-none">
              {children}
              <Feedback pageId={router.asPath} />
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy</span>
                <span className="text-sm">Privacy Policy</span>
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Terms</span>
                <span className="text-sm">Terms of Service</span>
              </Link>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Your Company. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HelpCenterLayout;
