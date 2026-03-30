import { Area, AreaChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, BarChart, Bar, Cell } from 'recharts';
import { Card } from '@/components/ui/Card';
import { PageIntro } from '@/features/shared/PageIntro';
import { useAnalytics } from '@/features/analytics/useAnalytics';

const mixColors: Record<string, string> = {
  UPI: 'var(--cyan)',
  CARD: 'var(--navy)',
  QR: '#DB2777',
  WALLET: 'var(--amber)',
};

export function AnalyticsPage() {
  const { data, healthScore } = useAnalytics();

  const methodMixWithColors = data.methodMix.map((entry) => ({
    ...entry,
    fill: mixColors[entry.method] ?? 'var(--text-muted)',
  }));

  return (
    <PageIntro label="Overview" subtitle="Track payment health, volume, success trends, and the shape of your settlement behavior over time." title="Analytics">
      <Card accent="navy" className="health-score-card">
        <div className="health-ring"><div className="health-ring-core">{healthScore}</div></div>
        <div className="health-score-copy">
          <div className="health-label">Payment health score</div>
          <div className="health-sublabel">A blended score using success rate, dispute load, settlement velocity, and anomaly rate.</div>
          <div className="health-trend">↑ +3 points from last week</div>
        </div>
      </Card>

      <div className="chart-grid analytics-grid-top">
        <Card accent="cyan" className="chart-card chart-span-12">
          <div className="chart-header">
            <div>
              <div className="chart-title">Payment Volume</div>
              <div className="chart-subtitle">Total collected per day (in Rs.)</div>
            </div>
          </div>
          <ResponsiveContainer height={280} width="100%">
            <AreaChart data={data.volume} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString()}`, 'Amount']} labelStyle={{ fontWeight: 600 }} />
              <Area dataKey="amount" fill="rgba(0, 185, 241, 0.16)" stroke="var(--cyan)" strokeWidth={3} type="monotone" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card accent="success" className="chart-card chart-span-7">
          <div className="chart-header">
            <div>
              <div className="chart-title">Success Rate Trend</div>
              <div className="chart-subtitle">Daily payment success rate (%)</div>
            </div>
          </div>
          <ResponsiveContainer height={260} width="100%">
            <LineChart data={data.successTrend} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
              <YAxis domain={[88, 100]} stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => [`${Number(value)}%`, 'Success Rate']} labelStyle={{ fontWeight: 600 }} />
              <Line dataKey="successRate" dot={{ r: 4, fill: 'var(--success)' }} stroke="var(--success)" strokeWidth={3} type="monotone" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card accent="warning" className="chart-card chart-span-5">
          <div className="chart-header">
            <div>
              <div className="chart-title">Method Mix</div>
              <div className="chart-subtitle">Share of payment volume by method</div>
            </div>
          </div>
          <div className="method-mix-chart-container">
            <ResponsiveContainer height={180} width="100%">
              <PieChart>
                <Pie data={methodMixWithColors} dataKey="amount" nameKey="method" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {methodMixWithColors.map((entry) => <Cell fill={entry.fill} key={entry.method} />)}
                </Pie>
                <Tooltip formatter={(value) => [`${Number(value)}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="method-mix-legend-vertical">
              {data.methodMix.map((entry) => (
                <div className="method-mix-legend-row" key={entry.method}>
                  <span className="method-mix-swatch" style={{ background: mixColors[entry.method] }} />
                  <span className="method-mix-name">{entry.method}</span>
                  <span className="method-mix-pct">{entry.amount}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card accent="navy" className="chart-card chart-span-12">
          <div className="chart-header">
            <div>
              <div className="chart-title">Settlement Lag Distribution</div>
              <div className="chart-subtitle">Number of transactions by days to settle (T+N)</div>
            </div>
          </div>
          <ResponsiveContainer height={240} width="100%">
            <BarChart data={data.settlementLag} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <XAxis dataKey="daysLag" stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: 'var(--border)' }} tickFormatter={(value) => `T+${value}`} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} label={{ value: 'Transactions', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: 'var(--text-muted)' } }} />
              <Tooltip formatter={(value) => [`${Number(value)} transactions`, 'Count']} labelFormatter={(label) => `Settlement: T+${label} days`} />
              <Bar dataKey="count" fill="var(--navy)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="insight-grid">
        {data.insights.map((insight) => (
          <div className="insight-card" key={insight.title}>
            <div className="insight-title">{insight.title}</div>
            <div className="insight-body">{insight.body}</div>
            <div className="insight-action">{insight.action}</div>
          </div>
        ))}
      </div>
    </PageIntro>
  );
}
