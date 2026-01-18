// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

const SEC_EDGAR_URL = 'https://www.sec.gov';
const USER_AGENT = 'AICFO/0.1.0 (Financial Intelligence Platform; contact@aicfo.com)';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SECCompany {
  cik: string;
  name: string;
  ticker: string;
  exchange?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    console.log('[Search API] Query:', query);

    // Fetch from SEC EDGAR
    const response = await fetch(`${SEC_EDGAR_URL}/files/company_tickers.json`, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`SEC API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('[Search API] Total companies:', Object.keys(data).length);

    // Convert object to array
    const companies = Object.values(data) as Array<{
      cik_str: number;
      ticker: string;
      title: string;
    }>;

    // Search by ticker or company name
    const searchLower = query.toLowerCase();
    const results = companies
      .filter((company) => {
        const tickerMatch = company.ticker.toLowerCase().includes(searchLower);
        const nameMatch = company.title.toLowerCase().includes(searchLower);
        return tickerMatch || nameMatch;
      })
      .slice(0, 20) // Limit to 20 results
      .map((company) => ({
        cik: company.cik_str.toString().padStart(10, '0'),
        name: company.title,
        ticker: company.ticker,
        exchange: 'US Market',
      }));

    console.log('[Search API] Results found:', results.length);

    return NextResponse.json({
      results,
      count: results.length,
      query,
    });
  } catch (error) {
    console.error('[Search API] Error:', error);

    // Fallback: Return popular companies
    const popularCompanies: SECCompany[] = [
      { cik: '0000320193', name: 'Apple Inc.', ticker: 'AAPL', exchange: 'NASDAQ' },
      { cik: '0001318605', name: 'Tesla Inc.', ticker: 'TSLA', exchange: 'NASDAQ' },
      { cik: '0000789019', name: 'Microsoft Corp.', ticker: 'MSFT', exchange: 'NASDAQ' },
      { cik: '0001018724', name: 'Amazon.com Inc.', ticker: 'AMZN', exchange: 'NASDAQ' },
      { cik: '0001652044', name: 'Alphabet Inc.', ticker: 'GOOGL', exchange: 'NASDAQ' },
    ];

    const query = new URL(request.url).searchParams.get('q') || '';
    const searchLower = query.toLowerCase();
    const filtered = popularCompanies.filter((company) => {
      const tickerMatch = company.ticker.toLowerCase().includes(searchLower);
      const nameMatch = company.name.toLowerCase().includes(searchLower);
      return tickerMatch || nameMatch;
    });

    return NextResponse.json({
      results: filtered,
      count: filtered.length,
      query,
      fallback: true,
    });
  }
}
