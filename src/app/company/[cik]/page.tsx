// src/app/company/[cik]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FinancialChart from '@/components/FinancialChart';
import RiskAlerts from '@/components/RiskAlerts';

// Types
interface CompanyData {
  company: {
    cik: string;
    name: string;
    ticker: string;
  };
  financials: Array<{
    period: string;
    revenue?: number;
    netIncome?: number;
    assets?: number;
    liabilities?: number;
    equity?: number;
    cash?: number;
    operatingCashFlow?: number;
  }>;
  risks: Array<{
    id: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    title: string;
    description: string;
    riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    metric?: string;
    currentValue?: number;
    threshold?: number;
    evidence?: string[];
  }>;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cik = params?.cik as string;

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cik) return;

    const fetchCompanyData = async () => {
      try {
        console.log('[Company Page] Fetching data for CIK:', cik);
        const response = await fetch(`/api/company/${cik}`);

        if (!response.ok) {
          throw new Error('Failed to fetch company data');
        }

        const data = await response.json();
        console.log('[Company Page] Data received:', data);
        setCompanyData(data);
      } catch (err) {
        console.error('[Company Page] Error:', err);
        setError('Failed to load company data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [cik]);

  // Format currency
  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    const billions = value / 1000000000;
    return `$${billions.toFixed(1)}B`;
  };

  // Calculate change percentage
  const calculateChange = (current?: number, previous?: number) => {
    if (!current || !previous || previous === 0) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (error || !companyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Company not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const latest = companyData.financials[0];
  const previous = companyData.financials[1];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4" translate="no">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {companyData.company.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    {companyData.company.ticker}
                  </span>
                  <span className="text-gray-600">CIK: {companyData.company.cik}</span>
                </div>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📊 Financial Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Revenue */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(latest?.revenue)}
              </p>
              {calculateChange(latest?.revenue, previous?.revenue) && (
                <p className={`text-sm ${calculateChange(latest?.revenue, previous?.revenue)! > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateChange(latest?.revenue, previous?.revenue)! > 0 ? '↑' : '↓'}{' '}
                  {Math.abs(calculateChange(latest?.revenue, previous?.revenue)!).toFixed(1)}%
                </p>
              )}
            </div>

            {/* Net Income */}
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Net Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(latest?.netIncome)}
              </p>
              {calculateChange(latest?.netIncome, previous?.netIncome) && (
                <p className={`text-sm ${calculateChange(latest?.netIncome, previous?.netIncome)! > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {calculateChange(latest?.netIncome, previous?.netIncome)! > 0 ? '↑' : '↓'}{' '}
                  {Math.abs(calculateChange(latest?.netIncome, previous?.netIncome)!).toFixed(1)}%
                </p>
              )}
            </div>

            {/* Total Assets */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Assets</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(latest?.assets)}
              </p>
            </div>

            {/* Cash */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Cash</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(latest?.cash)}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Chart */}
        {companyData.financials?.length > 0 ? (
  <div className="mb-6">
    <FinancialChart 
      data={companyData.financials} 
      title="12-Quarter Financial Trends"
    />
  </div>
) : null}

        )}

        {/* Risk Alerts */}
        <div className="mb-6">
          <RiskAlerts risks={companyData.risks} />
        </div>

        {/* Financial Statements */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            📊 Financial Statements (12 Quarters)
          </h2>
          
          {/* Income Statement */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Income Statement</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Net Income</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companyData.financials.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.period} {index === 0 && <span className="text-blue-600 font-semibold">(Latest)</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(item.revenue)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(item.netIncome)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Balance Sheet */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Balance Sheet</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Assets</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Liabilities</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Equity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companyData.financials.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.period} {index === 0 && <span className="text-blue-600 font-semibold">(Latest)</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(item.assets)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(item.liabilities)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(item.equity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cash Flow Statement */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Cash Flow Statement</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Operating Cash Flow</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cash</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companyData.financials.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.period} {index === 0 && <span className="text-blue-600 font-semibold">(Latest)</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(item.operatingCashFlow)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">
                        {formatCurrency(item.cash)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
