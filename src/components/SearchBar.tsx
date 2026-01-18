'use client';

import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or ticker (e.g., Apple, AAPL, TSLA)..."
            className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <span className="mr-2">Try:</span>
        <button
          type="button"
          onClick={() => {
            setQuery('Apple');
            onSearch('Apple');
          }}
          className="mr-3 text-blue-600 hover:underline"
        >
          Apple
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery('TSLA');
            onSearch('TSLA');
          }}
          className="mr-3 text-blue-600 hover:underline"
        >
          TSLA
        </button>
        <button
          type="button"
          onClick={() => {
            setQuery('Microsoft');
            onSearch('Microsoft');
          }}
          className="text-blue-600 hover:underline"
        >
          Microsoft
        </button>
      </div>
    </form>
  );
}
