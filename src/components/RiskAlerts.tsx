// src/components/RiskAlerts.tsx
'use client';

interface RiskResult {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  metric?: string;
  currentValue?: number;
  threshold?: number;
  evidence?: string[];
}

interface RiskAlertsProps {
  risks: RiskResult[];
}

export default function RiskAlerts({ risks }: RiskAlertsProps) {
  if (!risks || risks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-2xl">✅</span>
          Risk Alerts
        </h3>
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-2xl">✓</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-green-800">No Risks Detected</p>
              <p className="text-sm text-green-600 mt-1">
                All financial metrics are within healthy ranges. The company shows strong financial health.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50',
          border: 'border-red-300',
          hoverBorder: 'hover:border-red-400',
          textColor: 'text-red-800',
          icon: '🔴',
          iconBg: 'bg-red-500',
          badge: 'bg-red-100 text-red-800 border-red-300',
          glow: 'shadow-red-100',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          border: 'border-yellow-300',
          hoverBorder: 'hover:border-yellow-400',
          textColor: 'text-yellow-800',
          icon: '🟡',
          iconBg: 'bg-yellow-500',
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          glow: 'shadow-yellow-100',
        };
      case 'LOW':
        return {
          bg: 'bg-gradient-to-r from-blue-50 to-cyan-50',
          border: 'border-blue-300',
          hoverBorder: 'hover:border-blue-400',
          textColor: 'text-blue-800',
          icon: '🔵',
          iconBg: 'bg-blue-500',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          glow: 'shadow-blue-100',
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-300',
          hoverBorder: 'hover:border-gray-400',
          textColor: 'text-gray-800',
          icon: '⚪',
          iconBg: 'bg-gray-500',
          badge: 'bg-gray-100 text-gray-800 border-gray-300',
          glow: 'shadow-gray-100',
        };
    }
  };

  const highRisks = risks.filter(r => r.severity === 'HIGH').length;
  const mediumRisks = risks.filter(r => r.severity === 'MEDIUM').length;
  const lowRisks = risks.filter(r => r.severity === 'LOW').length;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-200">
      {/* Header with Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Risk Alerts
          </h3>
          <div className="flex items-center gap-2">
            {highRisks > 0 && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold border border-red-300">
                {highRisks} High
              </span>
            )}
            {mediumRisks > 0 && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold border border-yellow-300">
                {mediumRisks} Medium
              </span>
            )}
            {lowRisks > 0 && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold border border-blue-300">
                {lowRisks} Low
              </span>
            )}
          </div>
        </div>

        {/* Risk Summary Bar */}
        <div className="flex gap-2 h-2 rounded-full overflow-hidden bg-gray-200">
          {highRisks > 0 && (
            <div 
              className="bg-red-500 transition-all duration-500 animate-pulse" 
              style={{ width: `${(highRisks / risks.length) * 100}%` }}
            />
          )}
          {mediumRisks > 0 && (
            <div 
              className="bg-yellow-500 transition-all duration-500" 
              style={{ width: `${(mediumRisks / risks.length) * 100}%` }}
            />
          )}
          {lowRisks > 0 && (
            <div 
              className="bg-blue-500 transition-all duration-500" 
              style={{ width: `${(lowRisks / risks.length) * 100}%` }}
            />
          )}
        </div>
      </div>

      {/* Risk Cards */}
      <div className="space-y-4">
        {risks.map((risk) => {
          const config = getSeverityConfig(risk.severity);
          
          return (
            <div
              key={risk.id}
              className={`
                border-2 rounded-lg p-5 transition-all duration-300
                ${config.bg} ${config.border} ${config.hoverBorder} ${config.glow}
                hover:shadow-xl hover:scale-[1.02] transform
              `}
            >
              {/* Card Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-12 h-12 ${config.iconBg} rounded-full 
                  flex items-center justify-center text-2xl
                  shadow-lg animate-pulse
                `}>
                  {config.icon}
                </div>

                {/* Title and Badge */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className={`text-lg font-bold ${config.textColor} leading-tight`}>
                      {risk.title}
                    </h4>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-bold border
                      ${config.badge} whitespace-nowrap
                    `}>
                      {risk.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {risk.description}
                  </p>
                </div>
              </div>

              {/* Metrics Section */}
              {risk.metric && (risk.currentValue !== undefined || risk.threshold !== undefined) && (
                <div className="mt-4 pt-4 border-t-2 border-white/50">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/60 rounded-lg p-3 backdrop-blur-sm">
                      <p className="text-xs text-gray-600 font-medium mb-1">Metric</p>
                      <p className="text-sm font-bold text-gray-900">{risk.metric}</p>
                    </div>
                    {risk.currentValue !== undefined && (
                      <div className="bg-white/60 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs text-gray-600 font-medium mb-1">Current Value</p>
                        <p className={`text-sm font-bold ${config.textColor}`}>
                          {risk.currentValue.toFixed(2)}
                        </p>
                      </div>
                    )}
                    {risk.threshold !== undefined && (
                      <div className="bg-white/60 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs text-gray-600 font-medium mb-1">Threshold</p>
                        <p className="text-sm font-bold text-gray-700">
                          {risk.threshold.toFixed(2)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Visual Progress Bar */}
                  {risk.currentValue !== undefined && risk.threshold !== undefined && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <span>Risk Level:</span>
                        <span className="font-semibold">
                          {((risk.currentValue / risk.threshold) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/80 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${config.iconBg} transition-all duration-1000`}
                          style={{ 
                            width: `${Math.min((risk.currentValue / risk.threshold) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Evidence Section */}
              {risk.evidence && risk.evidence.length > 0 && (
                <div className="mt-4 pt-4 border-t-2 border-white/50">
                  <p className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span>📋</span>
                    Evidence:
                  </p>
                  <ul className="space-y-2">
                    {risk.evidence.map((item, i) => (
                      <li 
                        key={i} 
                        className="flex items-start gap-2 text-sm text-gray-700 bg-white/60 rounded-lg p-2 backdrop-blur-sm"
                      >
                        <span className="text-gray-400 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button className={`
                  flex-1 px-4 py-2 rounded-lg font-semibold text-sm
                  transition-all duration-200 transform hover:scale-105
                  ${risk.severity === 'HIGH' 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg' 
                    : risk.severity === 'MEDIUM'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  }
                `}>
                  🎯 Create Action
                </button>
                <button className="
                  px-4 py-2 border-2 border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-semibold
                  hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105
                  shadow-md
                ">
                  📊 View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div className="mt-6 pt-6 border-t-2 border-gray-200">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            💡 <span className="font-semibold">{risks.length} risk{risks.length !== 1 ? 's' : ''}</span> detected. 
            Review and create action items to mitigate potential issues.
          </p>
        </div>
      </div>
    </div>
  );
}
