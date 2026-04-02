import { Suspense, lazy, useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { queryClient } from '@/lib/queryClient';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';

const LandingPage = lazy(() => import('@/routes/LandingPage').then((module) => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('@/features/auth/LoginPage').then((module) => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('@/features/auth/SignupPage').then((module) => ({ default: module.SignupPage })));
const OnboardingFlow = lazy(() => import('@/features/auth/OnboardingFlow').then((module) => ({ default: module.OnboardingFlow })));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const VerifierPage = lazy(() => import('@/features/verifier/VerifierPage').then((module) => ({ default: module.VerifierPage })));
const ReconciliationPage = lazy(() => import('@/features/reconciliation/ReconciliationPage').then((module) => ({ default: module.ReconciliationPage })));
const DisputesPage = lazy(() => import('@/features/disputes/DisputesPage').then((module) => ({ default: module.DisputesPage })));
const VoicePage = lazy(() => import('@/features/voice/VoicePage').then((module) => ({ default: module.VoicePage })));
const RouterInsightsPage = lazy(() => import('@/features/router-insights/RouterInsightsPage').then((module) => ({ default: module.RouterInsightsPage })));
const EndOfDayPage = lazy(() => import('@/features/end-of-day/EndOfDayPage').then((module) => ({ default: module.EndOfDayPage })));
const AnalyticsPage = lazy(() => import('@/features/analytics/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const NotificationsPage = lazy(() => import('@/features/notifications/NotificationsPage').then((module) => ({ default: module.NotificationsPage })));
const PaymentLinksPage = lazy(() => import('@/features/payment-links/PaymentLinksPage').then((module) => ({ default: module.PaymentLinksPage })));
const SettingsPage = lazy(() => import('@/features/settings/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const ActionFeedPage = lazy(() => import('@/features/action-feed/ActionFeedPage').then((module) => ({ default: module.ActionFeedPage })));
const AutoSweepPage = lazy(() => import('@/features/auto-sweep/AutoSweepPage').then((module) => ({ default: module.AutoSweepPage })));
const VyaparSetuPage = lazy(() => import('@/features/vyapar-setu/VyaparSetuPage').then((module) => ({ default: module.VyaparSetuPage })));
const VoiceNegotiatorPage = lazy(() => import('@/features/voice-negotiator/VoiceNegotiatorPage').then((module) => ({ default: module.VoiceNegotiatorPage })));
const GenAIAdsPage = lazy(() => import('@/features/genai-ads/GenAIAdsPage').then((module) => ({ default: module.GenAIAdsPage })));

function RouteLoadingFallback() {
  return <div className="route-loading">Loading PayAssist...</div>;
}

function App() {
  useAuthBootstrap();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem('payassist-theme');
    return saved === 'dark' || saved === 'light' ? saved : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem('payassist-theme', theme);
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            <Route
              path="/"
              element={<LandingPage theme={theme} onToggleTheme={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))} />}
            />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/onboarding" element={<OnboardingFlow />} />

            <Route
              path="/app"
              element={(
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              )}
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="verify" element={<VerifierPage />} />
              <Route path="reconciliation" element={<ReconciliationPage />} />
              <Route path="disputes" element={<DisputesPage />} />
              <Route path="voice" element={<VoicePage />} />
              <Route path="router-insights" element={<RouterInsightsPage />} />
              <Route path="end-of-day" element={<EndOfDayPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="payment-links" element={<PaymentLinksPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="action-feed" element={<ActionFeedPage />} />
              <Route path="auto-sweep" element={<AutoSweepPage />} />
              <Route path="vyapar-setu" element={<VyaparSetuPage />} />
              <Route path="voice-negotiator" element={<VoiceNegotiatorPage />} />
              <Route path="genai-ad-engine" element={<GenAIAdsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}

export default App;
