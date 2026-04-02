import { useEffect, useMemo, useState } from 'react';
import { demoActionFeed } from '@/data/copilotDemoData';
import { geminiClient } from '@/lib/gemini';
import type { ActionFeedResponse, CopilotActionFeedItem, CopilotActionStatus } from '@/types/copilot.types';

export function useActionFeed(context?: Record<string, unknown>) {
  const contextKey = JSON.stringify(context ?? {});
  const [payload, setPayload] = useState<ActionFeedResponse>(demoActionFeed);
  const [loading, setLoading] = useState(true);
  const [liveStatus, setLiveStatus] = useState<Record<string, CopilotActionStatus>>(
    Object.fromEntries(demoActionFeed.actions.map((item) => [item.id, item.status]))
  );

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    void geminiClient
      .getActionFeed(context ?? {})
      .then((result) => {
        if (cancelled) return;
        setPayload(result);
        setLiveStatus((current) => ({
          ...Object.fromEntries(result.actions.map((item) => [item.id, current[item.id] ?? item.status])),
          ...current,
        }));
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [contextKey]);

  const actions = useMemo(
    () =>
      payload.actions.map((item) => ({
        ...item,
        status: liveStatus[item.id] ?? item.status,
      })) as CopilotActionFeedItem[],
    [liveStatus, payload.actions]
  );

  const takeAction = (actionId: string, status: CopilotActionStatus) => {
    setLiveStatus((current) => ({ ...current, [actionId]: status }));
  };

  const pendingCount = actions.filter((item) => item.status === 'pending').length;

  return {
    loading,
    generatedAt: payload.generatedAt,
    narrative: payload.narrative,
    actions,
    pendingCount,
    takeAction,
  };
}
