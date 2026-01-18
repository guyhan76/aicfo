// src/app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SECCompany {
  cik: string;
  name: string;
  ticker: string;
  exchange?: string;
}

// CompanyCard Component (Inline)
function CompanyCard({ company }: { company: SECCompany }) {
  return (
    <Link
      href={`/company/${company.cik}`}
      className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {company.name}
      </h3>

      <div className="flex items-center gap-3 mb-3">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
          {company.ticker}
        </span>
        {company.exchange && (
          <span className="text-sm text-gray-600">
            {company.exchange}
          </span>
        )}
      </div>

      <div className="text-sm text-gray-500 mb-4">
        CIK: {company.cik}
      </div>

      <div className="text-blue-600 hover:underline text-sm font-medium">
        View Analysis →
      </div>
    </Link>
  );
}

// Dashboard Page
export default function DashboardPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SECCompany[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setError('Please enter a company name or ticker');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('[Dashboard] Searching for:', searchQuery);
      
      // Call API Route instead of direct API call
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      console.log('[Dashboard] Results:', data.results.length);
      
      setResults(data.results);

      if (data.results.length === 0) {
        setError('No companies found');
      }
    } catch (err) {
      console.error('[Dashboard] Search failed:', err);
      setError('Failed to search companies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const popularCompanies: SECCompany[] = [
    { cik: '0000320193', name: 'Apple Inc.', ticker: 'AAPL', exchange: 'NASDAQ' },
    { cik: '0001318605', name: 'Tesla Inc.', ticker: 'TSLA', exchange: 'NASDAQ' },
    { cik: '0000789019', name: 'Microsoft Corp.', ticker: 'MSFT', exchange: 'NASDAQ' },
    { cik: '0001018724', name: 'Amazon.com Inc.', ticker: 'AMZN', exchange: 'NASDAQ' },
    { cik: '0001652044', name: 'Alphabet Inc.', ticker: 'GOOGL', exchange: 'NASDAQ' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" translate="no">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔍 AICFO Dashboard
          </h1>
          <p className="text-gray-600">
            Search 3,500+ US public companies and analyze financial data
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by company name or ticker (e.g., Apple, TSLA)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Search Results ({results.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((company) => (
                <CompanyCard key={company.cik} company={company} />
              ))}
            </div>
          </div>
        )}

        {/* Popular Companies */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🔥 Popular Companies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCompanies.map((company) => (
              <CompanyCard key={company.cik} company={company} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-blue-600">3,500+</div>
            <div className="text-gray-600">US Public Companies</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-blue-600">30 Years</div>
            <div className="text-gray-600">Financial Data</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl font-bold text-blue-600">10+</div>
            <div className="text-gray-600">Risk Detection Rules</div>
          </div>
        </div>
      </div>
    </div>
  );
}
