'use client';

interface Financial {
  period: string;
  revenue?: number;
  netIncome?: number;
  assets?: number;
  liabilities?: number;
  equity?: number;
  cash?: number;
  operatingCashFlow?: number;
}

interface FinancialStatementsProps {
  financials: Financial[];
  companyTicker: string;
}

export default function FinancialStatements({ financials, companyTicker }: FinancialStatementsProps) {
  const formatCurrency = (value?: number) => {
    if (!value || typeof value !== 'number') return '-';
    return `$${(value / 1e9).toFixed(2)}B`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return dateString;
    }
  };

  if (!financials || financials.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📈 Financial Statements
        </h2>
        <p className="text-gray-600">No financial data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        📈 Financial Statements (12 Quarters)
      </h2>

      {/* Income Statement */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Income Statement</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Income</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Margin %</th>
              </tr>
            </thead>
            <tbody>
              {financials.slice(0, 12).map((financial, index) => {
                const margin = financial.revenue && financial.netIncome
                  ? ((financial.netIncome / financial.revenue) * 100).toFixed(1)
                  : '-';
                
                return (
                  <tr 
                    key={`income-${index}`}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${index === 0 ? 'bg-blue-50' : ''}`}
                  >
                    <td className="py-3 px-4 font-medium">
                      {formatDate(financial.period)}
                      {index === 0 && <span className="ml-2 text-xs text-blue-600">(Latest)</span>}
                    </td>
                    <td className="py-3 px-4 text-right">{formatCurrency(financial.revenue)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(financial.netIncome)}</td>
                    <td className="py-3 px-4 text-right">{margin}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Sheet */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Balance Sheet</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Assets</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Liabilities</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Equity</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Cash</th>
              </tr>
            </thead>
            <tbody>
              {financials.slice(0, 12).map((financial, index) => (
                <tr 
                  key={`balance-${index}`}
                  className={`border-b border-gray-200 hover:bg-gray-50 ${index === 0 ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-3 px-4 font-medium">
                    {formatDate(financial.period)}
                    {index === 0 && <span className="ml-2 text-xs text-blue-600">(Latest)</span>}
                  </td>
                  <td className="py-3 px-4 text-right">{formatCurrency(financial.assets)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(financial.liabilities)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(financial.equity)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(financial.cash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Flow Statement */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Cash Flow Statement</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Period</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Operating Cash Flow</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Net Income</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Difference</th>
              </tr>
            </thead>
            <tbody>
              {financials.slice(0, 12).map((financial, index) => {
                const diff = financial.operatingCashFlow && financial.netIncome
                  ? ((financial.operatingCashFlow - financial.netIncome) / 1e9).toFixed(2)
                  : '-';
                
                return (
                  <tr 
                    key={`cashflow-${index}`}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${index === 0 ? 'bg-blue-50' : ''}`}
                  >
                    <td className="py-3 px-4 font-medium">
                      {formatDate(financial.period)}
                      {index === 0 && <span className="ml-2 text-xs text-blue-600">(Latest)</span>}
                    </td>
                    <td className="py-3 px-4 text-right">{formatCurrency(financial.operatingCashFlow)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(financial.netIncome)}</td>
                    <td className={`py-3 px-4 text-right ${diff !== '-' && parseFloat(diff) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {diff !== '-' ? `$${diff}B` : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
