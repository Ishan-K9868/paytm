import { Area, AreaChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, BarChart, Bar, Cell } from 'recharts';
import { Card } from '@/components/ui/Card';
import { PageIntro } from '@/features/shared/PageIntro';
import { useAnalytics } from '@/features/analytics/useAnalytics';

const mixColors = ['#00B9F1', '#002E6E', '#F5A623', '#DB2777'];

export function AnalyticsPage() {
  const { data, healthScore } = useAnalytics();

  return (
    <PageIntro label="Overview" subtitle="Track payment health, volume, success trends, and the shape of your settlement behavior over time." title="Analytics">
      <Card accent="navy" className="health-score-card">
        <div className="health-ring"><div className="health-ring-core">{healthScore}</div></div>
        <div>
          <div className="health-label">Payment health score</div>
          <div className="health-sublabel">A blended score using success rate, dispute load, settlement velocity, and anomaly rate.</div>
          <div className="health-trend">↑ +3 points from last week</div>
        </div>
      </Card>

      <div className="chart-grid analytics-grid-top">
        <Card accent="cyan" className="chart-card chart-span-12">
          <div className="chart-title">Payment Volume</div>
          <div className="chart-subtitle">Total collected per day</div>
          <ResponsiveContainer height={280} width="100%"><AreaChart data={data.volume}><XAxis dataKey="date" stroke="var(--text-muted)" /><YAxis stroke="var(--text-muted)" /><Tooltip /><Area dataKey="amount" fill="rgba(0, 185, 241, 0.16)" stroke="#00B9F1" strokeWidth={3} type="monotone" /></AreaChart></ResponsiveContainer>
        </Card>
        <Card accent="success" className="chart-card chart-span-7">
          <div className="chart-title">Success Rate Trend</div>
          <ResponsiveContainer height={260} width="100%"><LineChart data={data.successTrend}><XAxis dataKey="date" stroke="var(--text-muted)" /><YAxis domain={[88, 100]} stroke="var(--text-muted)" /><Tooltip /><Line dataKey="successRate" dot={{ r: 4 }} stroke="#16A34A" strokeWidth={3} type="monotone" /></LineChart></ResponsiveContainer>
        </Card>
        <Card accent="warning" className="chart-card chart-span-5">
          <div className="chart-title">Method mix</div>
          <ResponsiveContainer height={260} width="100%"><PieChart><Pie data={data.methodMix} dataKey="amount" innerRadius={56} outerRadius={90}>{data.methodMix.map((entry, index) => <Cell fill={mixColors[index % mixColors.length]} key={entry.method} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </Card>
        <Card accent="navy" className="chart-card chart-span-12">
          <div className="chart-title">Settlement Lag</div>
          <ResponsiveContainer height={240} width="100%"><BarChart data={data.settlementLag}><XAxis dataKey="daysLag" stroke="var(--text-muted)" /><YAxis stroke="var(--text-muted)" /><Tooltip /><Bar dataKey="count" fill="#002E6E" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
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
