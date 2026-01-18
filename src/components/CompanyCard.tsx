// src/components/CompanyCard.tsx
import Link from 'next/link';
import { SECCompany } from '@/lib/sec-edgar/api-client';

interface CompanyCardProps {
  company: SECCompany;
}

export default function CompanyCard({ company }: CompanyCardProps) {
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