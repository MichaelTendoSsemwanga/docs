import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiSearch, FiClock, FiFileText, FiExternalLink } from 'react-icons/fi';
import Layout from '../../components/Layout';
import SearchBar from '../components/SearchBar';

// Mock search function - replace with actual API call
const searchContent = async (query) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock search results
      const allResults = [
        {
          id: 1,
          title: 'Creating an Event',
          description: 'Learn how to create and publish your first event with our step-by-step guide. Includes information on setting up ticket types, pricing, and event details.',
          url: '/help/events/creating-events',
          category: 'Events',
          type: 'guide',
          lastUpdated: '2023-05-15',
          relevance: 0.95
        },
        {
          id: 2,
          title: 'Managing Tickets',
          description: 'How to manage and track ticket sales, issue refunds, and handle attendee information.',
          url: '/help/events/managing-tickets',
          category: 'Events',
          type: 'guide',
          lastUpdated: '2023-05-10',
          relevance: 0.88
        },
        {
          id: 3,
          title: 'Payment Setup',
          description: 'Configure payment methods, set up payouts, and manage your financial settings.',
          url: '/help/finances/payment-setup',
          category: 'Finances',
          type: 'guide',
          lastUpdated: '2023-05-05',
          relevance: 0.85
        },
        {
          id: 4,
          title: 'Team Management',
          description: 'Invite team members, set permissions, and manage access to your organization.',
          url: '/help/organization/team-management',
          category: 'Organization',
          type: 'guide',
          lastUpdated: '2023-04-28',
          relevance: 0.82
        },
        {
          id: 5,
          title: 'Check-in & Scanning',
          description: 'Set up and manage event check-ins using our mobile app or web interface.',
          url: '/help/orders-sales/checkin-scanning',
          category: 'Orders & Sales',
          type: 'guide',
          lastUpdated: '2023-04-20',
          relevance: 0.78
        },
        {
          id: 6,
          title: 'Event Promotion Guide',
          description: 'Best practices for promoting your event and increasing ticket sales.',
          url: '/help/marketing/event-promotion',
          category: 'Marketing',
          type: 'guide',
          lastUpdated: '2023-04-15',
          relevance: 0.75
        },
        {
          id: 7,
          title: 'API Documentation',
          description: 'Technical documentation for integrating with our platform using our REST API.',
          url: 'https://api.example.com/docs',
          category: 'Developers',
          type: 'external',
          lastUpdated: '2023-04-10',
          relevance: 0.70
        },
        {
          id: 8,
          title: 'Troubleshooting Common Issues',
          description: 'Solutions to common problems and frequently asked questions.',
          url: '/help/troubleshooting/common-issues',
          category: 'Troubleshooting',
          type: 'guide',
          lastUpdated: '2023-04-05',
          relevance: 0.65
        }
      ];

      // Filter results based on query
      const filtered = allResults.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
      );

      // Sort by relevance (in a real app, this would be handled by the search backend)
      const sorted = filtered.sort((a, b) => b.relevance - a.relevance);
      
      resolve(sorted);
    }, 500);
  });
};

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [query, setQuery] = useState(q || '');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        const parsed = JSON.parse(savedSearches);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, []);

  // Handle search when query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await searchContent(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query]);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      // Update URL with search query
      router.push(
        {
          pathname: '/help/search',
          query: { q: searchQuery },
        },
        undefined,
        { shallow: true }
      );
      setQuery(searchQuery);

      // Add to recent searches
      const updatedSearches = [
        { query: searchQuery, timestamp: new Date().toISOString() },
        ...recentSearches
          .filter((item) => item.query !== searchQuery)
          .slice(0, 4),
      ];
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  const ResultItem = ({ result }) => (
    <div className="mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          {result.type === 'guide' ? (
            <FiFileText className="h-5 w-5 text-blue-500" />
          ) : (
            <FiExternalLink className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div className="ml-3">
          <a
            href={result.url}
            className="text-lg font-medium text-blue-600 hover:underline"
            target={result.type === 'external' ? '_blank' : '_self'}
            rel={result.type === 'external' ? 'noopener noreferrer' : ''}
          >
            {result.title}
            {result.type === 'external' && (
              <FiExternalLink className="inline-block ml-1 w-3 h-3" />
            )}
          </a>
          <div className="mt-1 text-sm text-gray-500">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
              {result.category}
            </span>
            <span>Updated {new Date(result.lastUpdated).toLocaleDateString()}</span>
          </div>
          <p className="mt-1 text-gray-700">{result.description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <Head>
        <title>{query ? `${query} - Search Results` : 'Search'}</title>
        <meta name="description" content={`Search results for ${query}`} />
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {query ? `Search Results for "${query}"` : 'Search Help Center'}
          </h1>
          <div className="mt-6">
            <SearchBar
              initialQuery={query}
              onSearch={handleSearch}
              recentSearches={recentSearches}
              className="max-w-2xl"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6 mt-2"></div>
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="space-y-6">
            {results.length > 0 ? (
              <>
                <p className="text-sm text-gray-500">
                  Found {results.length} {results.length === 1 ? 'result' : 'results'}
                </p>
                <div className="divide-y divide-gray-200">
                  {results.map((result) => (
                    <ResultItem key={result.id} result={result} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <FiSearch className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
                <p className="mt-1 text-gray-500">
                  We couldn't find any matches for "{query}". Try different keywords or check
                  out our <a href="/help" className="text-blue-600 hover:underline">help center</a>.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">Recent searches</h3>
              {recentSearches.length > 0 ? (
                <ul className="mt-4 divide-y divide-gray-200">
                  {recentSearches.map((search, index) => (
                    <li key={index} className="py-3">
                      <button
                        onClick={() => handleSearch(search.query)}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FiClock className="h-5 w-5 text-gray-400 mr-2" />
                        {search.query}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  Your recent searches will appear here
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
