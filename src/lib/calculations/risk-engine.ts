// src/lib/calculations/risk-engine.ts
import { FinancialData } from '@/lib/sec-edgar/api-client';

export interface RiskResult {
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

export function detectRisks(financials: FinancialData[]): RiskResult[] {
  if (!financials || financials.length === 0) {
    return [];
  }

  const risks: RiskResult[] = [];

  const liquidityRisk = detectLiquidityRisk(financials);
  if (liquidityRisk) risks.push(liquidityRisk);

  const cashFlowRisk = detectCashFlowDiscrepancy(financials);
  if (cashFlowRisk) risks.push(cashFlowRisk);

  const leverageRisk = detectOperatingLeverageRisk(financials);
  if (leverageRisk) risks.push(leverageRisk);

  return risks;
}

function detectLiquidityRisk(financials: FinancialData[]): RiskResult | null {
  const latest = financials[0];
  if (!latest || !latest.assets || !latest.liabilities) return null;

  const currentRatio = latest.assets / latest.liabilities;
  const threshold = 1.5;

  if (currentRatio < threshold) {
    return {
      id: 'liquidity-risk',
      severity: 'HIGH',
      title: 'Liquidity Risk',
      description: `Current ratio (${currentRatio.toFixed(2)}) below threshold ${threshold}`,
      riskLevel: 'HIGH',
      metric: 'Current Ratio',
      currentValue: currentRatio,
      threshold,
      evidence: [
        `Assets: $${latest.assets.toLocaleString()}`,
        `Liabilities: $${latest.liabilities.toLocaleString()}`,
      ],
    };
  }

  return null;
}

export function detectCashFlowDiscrepancy(financials: FinancialData[]): RiskResult | null {
  const latest = financials[0];
  if (!latest || !latest.netIncome || !latest.operatingCashFlow) return null;

  const discrepancy = Math.abs(latest.netIncome - latest.operatingCashFlow);
  const discrepancyPercent = (discrepancy / Math.abs(latest.netIncome)) * 100;
  const threshold = 20;

  if (discrepancyPercent > threshold) {
    return {
      id: 'cash-flow-discrepancy',
      severity: 'MEDIUM',
      title: 'Cash Flow Discrepancy',
      description: `Operating cash flow differs from net income by ${discrepancyPercent.toFixed(1)}%`,
      riskLevel: 'MEDIUM',
      metric: 'Cash Flow vs Net Income',
      currentValue: discrepancyPercent,
      threshold,
      evidence: [
        `Net Income: $${latest.netIncome.toLocaleString()}`,
        `Operating Cash Flow: $${latest.operatingCashFlow.toLocaleString()}`,
      ],
    };
  }

  return null;
}

export function detectOperatingLeverageRisk(financials: FinancialData[]): RiskResult | null {
  if (financials.length < 4) return null;

  const oldRevenue = financials[3].revenue || 0;
  const newRevenue = financials[0].revenue || 0;
  const oldIncome = financials[3].netIncome || 0;
  const newIncome = financials[0].netIncome || 0;

  if (oldRevenue === 0 || oldIncome === 0) return null;

  const revenueChange = ((newRevenue - oldRevenue) / oldRevenue) * 100;
  const incomeChange = ((newIncome - oldIncome) / oldIncome) * 100;
  const leverage = revenueChange !== 0 ? incomeChange / revenueChange : 0;
  const threshold = 3.0;

  if (Math.abs(leverage) > threshold) {
    return {
      id: 'operating-leverage',
      severity: 'HIGH',
      title: 'Operating Leverage Risk',
      description: `High operating leverage (${leverage.toFixed(2)}x)`,
      riskLevel: 'HIGH',
      metric: 'Operating Leverage',
      currentValue: leverage,
      threshold,
      evidence: [
        `Revenue change: ${revenueChange.toFixed(1)}%`,
        `Income change: ${incomeChange.toFixed(1)}%`,
      ],
    };
  }

  return null;
}