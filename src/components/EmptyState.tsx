import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon"><Icon size={24} /></div>
      <div className="dashboard-panel-title">{title}</div>
      <div className="page-subtitle">{description}</div>
      {action ? <button className="btn-primary" onClick={action.onClick} type="button">{action.label}</button> : null}
    </div>
  );
}
