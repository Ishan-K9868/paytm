import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/Card';
import { PageIntro } from '@/features/shared/PageIntro';
import { useRouterInsights } from '@/features/router-insights/useRouterInsights';

const methodColors: Record<string, string> = {
  UPI: 'var(--cyan)',
  CARD: 'var(--navy)',
  NETBANKING: '#7C3AED',
  WALLET: 'var(--amber)',
  EMI: 'var(--success)',
  QR: '#DB2777',
};

export function RouterInsightsPage() {
  const { insights, recommendations, dateRange, setDateRange } = useRouterInsights();

  const totalTransactions = insights.reduce((sum, item) => sum + item.totalTransactions, 0);

  return (
    <PageIntro
      label="Payments"
      subtitle="See which payment rails are carrying revenue, which ones are failing, and what PayAssist wants you to change."
      title="Router Insights"
    >
      <div className="range-pill-row">
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button 
            className={`range-pill ${dateRange === range ? 'active' : ''}`} 
            key={range} 
            onClick={() => setDateRange(range)} 
            type="button"
          >
            {range.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="method-cards-row">
        {insights.map((insight) => (
          <Card accent="cyan" className="method-card" key={insight.paymentMethod} style={{ borderTop: `3px solid ${methodColors[insight.paymentMethod]}` }}>
            <div className="method-name">{insight.paymentMethod}</div>
            <div className={`method-rate ${insight.successRate > 95 ? 'good' : insight.successRate > 85 ? 'warning' : 'bad'}`}>{insight.successRate.toFixed(1)}%</div>
            <div className="method-label">{insight.totalTransactions.toLocaleString()} transactions</div>
            <div className="method-trend">{insight.trendDelta > 0 ? '↑' : insight.trendDelta < 0 ? '↓' : '→'} {Math.abs(insight.trendDelta)}% vs last range</div>
          </Card>
        ))}
      </div>

      <div className="chart-grid router-chart-grid">
        <Card accent="cyan" className="chart-card chart-span-7">
          <div className="chart-header">
            <div>
              <div className="chart-title">Success by method</div>
              <div className="chart-subtitle">Success rate (%) across active payment rails</div>
            </div>
          </div>
          <ResponsiveContainer height={280} width="100%">
            <BarChart data={insights} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <XAxis dataKey="paymentMethod" stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Success Rate']} />
              <Bar dataKey="successRate" radius={[8, 8, 0, 0]}>
                {insights.map((entry) => <Cell fill={methodColors[entry.paymentMethod]} key={entry.paymentMethod} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card accent="navy" className="chart-card chart-span-5">
          <div className="chart-header">
            <div>
              <div className="chart-title">Method mix</div>
              <div className="chart-subtitle">Share of payment traffic by method</div>
            </div>
          </div>
          <div className="method-mix-chart-container">
            <ResponsiveContainer height={180} width="100%">
              <PieChart>
                <Pie data={insights} dataKey="totalTransactions" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {insights.map((entry) => <Cell fill={methodColors[entry.paymentMethod]} key={entry.paymentMethod} />)}
                </Pie>
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString()} txns`, 'Volume']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="method-mix-legend-vertical">
              {insights.map((entry) => (
                <div className="method-mix-legend-row" key={entry.paymentMethod}>
                  <span className="method-mix-swatch" style={{ background: methodColors[entry.paymentMethod] }} />
                  <span className="method-mix-name">{entry.paymentMethod}</span>
                  <span className="method-mix-pct">{((entry.totalTransactions / totalTransactions) * 100).toFixed(0)}%</span>
                  <span className="method-mix-count">{entry.totalTransactions.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="recommendation-section">
        <div className="recommendation-section-header">
          <h3 className="recommendation-section-title">AI Routing Recommendations</h3>
          <span className="recommendation-section-subtitle">Based on {dateRange.toUpperCase()} performance data</span>
        </div>
        <div className="recommendation-stack">
          {recommendations.map((recommendation) => (
            <div className={`recommendation-card rec-${recommendation.type}`} key={`${recommendation.type}-${recommendation.paymentMethod}`}>
              <div className="rec-header">
                <span className={`rec-type-badge ${recommendation.type}`}>{recommendation.type.toUpperCase()}</span>
                <div className="rec-title">{recommendation.paymentMethod}</div>
              </div>
              <div className="rec-body">
                <div className="rec-reason">{recommendation.reason}</div>
                <div className="rec-impact">{recommendation.impact}</div>
              </div>
              <div className="rec-confidence">
                <span className="rec-confidence-label">Confidence</span>
                <div className="confidence-bar"><div className="confidence-fill" style={{ width: `${recommendation.confidence}%` }} /></div>
                <span className="rec-confidence-value">{recommendation.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageIntro>
  );
}
