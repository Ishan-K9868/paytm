import { useMemo, useState } from 'react';
import { demoReconciliationSummary } from '@/data/demoAppData';
import { paytmClient } from '@/lib/paytm';

void paytmClient;

export function useReconciliation() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'matched' | 'pending' | 'anomaly' | 'refunded'>('all');
  const [search, setSearch] = useState('');

  const filteredRecords = useMemo(() => {
    return demoReconciliationSummary.records.filter((record) => {
      const matchesFilter = statusFilter === 'all' ? true : record.status === statusFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch = query.length === 0
        ? true
        : record.orderId.toLowerCase().includes(query) || record.txnId.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [search, statusFilter]);

  return {
    summary: { ...demoReconciliationSummary, records: filteredRecords },
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
  };
}
