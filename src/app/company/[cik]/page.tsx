'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FinancialChart from '@/components/FinancialChart';
import RiskAlerts from '@/components/RiskAlerts';

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

export default function CompanyPage() {
  const params = useParams();
  const router = useRouter();
  const cik = params.cik as string;

  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cik) return;

    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/company/${cik}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch company data');
        }

        const data = await response.json();
        setCompanyData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [cik]);

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A';
    return `$${(value / 1000000000).toFixed(1)}B`;
  };

  const calculateChange = (current?: number, previous?: number) => {
    if (!current || !previous) return null;
    const change = ((current - previous) / previous) * 100;
    return change;
  };

  if (loading) {
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
          <p className="text-red-600 mb-4">{error || 'Company not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const latestFinancials = companyData.financials[0];
  const previousFinancials = companyData.financials[1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to Dashboard
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {companyData.company.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {companyData.company.ticker}
                </span>
                <span className="text-sm text-gray-500">
                  CIK: {companyData.company.cik}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Revenue */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(latestFinancials?.revenue)}
              </p>
              {(() => {
                const change = calculateChange(latestFinancials?.revenue, previousFinancials?.revenue);
                if (change !== null) {
                  return (
                    <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                    </p>
                  );
                }
                return null;
              })()}
            </div>

            {/* Net Income */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Net Income</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(latestFinancials?.netIncome)}
              </p>
              {(() => {
                const change = calculateChange(latestFinancials?.netIncome, previousFinancials?.netIncome);
                if (change !== null) {
                  return (
                    <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                    </p>
                  );
                }
                return null;
              })()}
            </div>

            {/* Total Assets */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Assets</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(latestFinancials?.assets)}
              </p>
              {(() => {
                const change = calculateChange(latestFinancials?.assets, previousFinancials?.assets);
                if (change !== null) {
                  return (
                    <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                    </p>
                  );
                }
                return null;
              })()}
            </div>

            {/* Cash */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Cash</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(latestFinancials?.cash)}
              </p>
              {(() => {
                const change = calculateChange(latestFinancials?.cash, previousFinancials?.cash);
                if (change !== null) {
                  return (
                    <p className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                    </p>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>

        {/* Financial Chart */}
        {companyData.financials && companyData.financials.length > 0 && (
          <div className="mb-6">
            <FinancialChart 
              data={companyData.financials} 
              title="12-Quarter Financial Trends" 
            />
          </div>
        )}

        {/* Risk Alerts */}
        <div className="mb-6">
          <RiskAlerts risks={companyData.risks} />
        </div>

        {/* Financial Statements */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Statements</h2>
          
          {/* Income Statement */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Income Statement</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Net Income</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companyData.financials.slice(0, 12).map((period, index) => (
                    <tr key={index} className={index === 0 ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {period.period}
                        {index === 0 && <span className="ml-2 text-xs text-blue-600 font-semibold">Latest</span>}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(period.revenue)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(period.netIncome)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Balance Sheet */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Balance Sheet</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Assets</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Liabilities</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Equity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companyData.financials.slice(0, 12).map((period, index) => (
                    <tr key={index} className={index === 0 ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {period.period}
                        {index === 0 && <span className="ml-2 text-xs text-blue-600 font-semibold">Latest</span>}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(period.assets)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(period.liabilities)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(period.equity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cash Flow Statement */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Cash Flow Statement</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Cash</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Operating Cash Flow</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companyData.financials.slice(0, 12).map((period, index) => (
                    <tr key={index} className={index === 0 ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {period.period}
                        {index === 0 && <span className="ml-2 text-xs text-blue-600 font-semibold">Latest</span>}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(period.cash)}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {formatCurrency(period.operatingCashFlow)}
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
