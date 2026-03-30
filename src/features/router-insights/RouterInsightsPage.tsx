import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/Card';
import { PageIntro } from '@/features/shared/PageIntro';
import { useRouterInsights } from '@/features/router-insights/useRouterInsights';

const methodColors: Record<string, string> = {
  UPI: '#00B9F1',
  CARD: '#002E6E',
  NETBANKING: '#7C3AED',
  WALLET: '#F5A623',
  EMI: '#059669',
  QR: '#DB2777',
};

export function RouterInsightsPage() {
  const { insights, recommendations, dateRange, setDateRange } = useRouterInsights();

  return (
    <PageIntro
      label="Payments"
      subtitle="See which payment rails are carrying revenue, which ones are failing, and what PayAssist wants you to change."
      title="Router Insights"
    >
      <div className="range-pill-row">
        {(['7d', '30d', '90d'] as const).map((range) => <button className={`filter-pill ${dateRange === range ? 'active' : ''}`} key={range} onClick={() => setDateRange(range)} type="button">{range.toUpperCase()}</button>)}
      </div>

      <div className="method-cards-row">
        {insights.map((insight) => (
          <Card accent="cyan" className="method-card" key={insight.paymentMethod} style={{ borderTop: `3px solid ${methodColors[insight.paymentMethod]}` }}>
            <div className="method-name">{insight.paymentMethod}</div>
            <div className={`method-rate ${insight.successRate > 95 ? 'good' : insight.successRate > 85 ? 'warning' : 'bad'}`}>{insight.successRate.toFixed(1)}%</div>
            <div className="method-label">{insight.totalTransactions} transactions</div>
            <div className="method-trend">{insight.trendDelta > 0 ? '↑' : insight.trendDelta < 0 ? '↓' : '→'} {insight.trendDelta}% vs last range</div>
          </Card>
        ))}
      </div>

      <div className="chart-grid">
        <Card accent="cyan" className="chart-card chart-span-7">
          <div className="chart-title">Success by method</div>
          <div className="chart-subtitle">Performance across active payment rails</div>
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={insights}>
              <XAxis dataKey="paymentMethod" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip />
              <Bar dataKey="successRate" radius={[8, 8, 0, 0]}>
                {insights.map((entry) => <Cell fill={methodColors[entry.paymentMethod]} key={entry.paymentMethod} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card accent="navy" className="chart-card chart-span-5">
          <div className="chart-title">Method mix</div>
          <div className="chart-subtitle">Share of payment traffic by method</div>
          <ResponsiveContainer height={280} width="100%">
            <PieChart>
              <Pie data={insights} dataKey="totalTransactions" innerRadius={58} outerRadius={94} paddingAngle={3}>
                {insights.map((entry) => <Cell fill={methodColors[entry.paymentMethod]} key={entry.paymentMethod} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="recommendation-stack">
        {recommendations.map((recommendation) => (
          <div className="recommendation-card" key={`${recommendation.type}-${recommendation.paymentMethod}`}>
            <div>
              <span className="rec-type-badge">{recommendation.type.toUpperCase()}</span>
              <div className="rec-title">{recommendation.paymentMethod}</div>
              <div className="rec-reason">{recommendation.reason}</div>
              <div className="rec-impact">{recommendation.impact}</div>
              <div className="rec-confidence"><span>Confidence</span><div className="confidence-bar"><div className="confidence-fill" style={{ width: `${recommendation.confidence}%` }} /></div><span>{recommendation.confidence}%</span></div>
            </div>
          </div>
        ))}
      </div>
    </PageIntro>
  );
}
