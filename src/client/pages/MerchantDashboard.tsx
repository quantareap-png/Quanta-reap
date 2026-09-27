/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles } from 'lucide-react';

interface MerchantDashboardProps {
  onOpenAddPurchase: () => void;
  onNavigateCustomers: () => void;
  onNavigateRewards: () => void;
  onNavigateLoyalty: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  onOpenAddPurchase,
}) => {
  const { currentBusiness } = useAuth();
  const { theme } = useTheme();

  const emptyStats = [
    { label: 'Customers', value: '0' },
    { label: 'Loyalty Members', value: '0' },
    { label: 'Points Issued', value: '0' },
    { label: 'Points Redeemed', value: '0' },
    { label: 'Purchases', value: '0' },
    { label: 'Rewards', value: '0' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-7 space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            style={{ color: theme.textPrimary }}
            className="text-2xl sm:text-3xl font-display font-medium tracking-tight"
          >
            Good morning, {currentBusiness?.name || 'Business'}
          </h1>
          <p
            style={{ color: theme.textSecondary }}
            className="text-[14px] sm:text-[15px] mt-1"
          >
            Your Quanta workspace is ready. Create your first customer, loyalty program, and reward to begin tracking real activity.
          </p>
        </div>

        <button
          id="dash-add-purchase-btn"
          onClick={onOpenAddPurchase}
          disabled={!currentBusiness}
          style={{
            backgroundColor: currentBusiness ? theme.accent : '#e2e8f0',
            color: currentBusiness ? theme.accentText : '#64748b',
          }}
          className="py-2.5 px-4 sm:px-5 rounded-lg text-[13px] font-medium transition-all hover:opacity-95 active:scale-[0.99] flex items-center gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-base font-light leading-none">+</span>
          <span>Add Purchase</span>
        </button>
      </div>

      <div
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.border }}
        className="rounded-xl border p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {emptyStats.map(stat => (
            <div
              key={stat.label}
              style={{ backgroundColor: theme.bgApp, borderColor: theme.border }}
              className="rounded-xl border p-4"
            >
              <div style={{ color: theme.textSecondary }} className="text-[11px] uppercase tracking-[0.08em] font-semibold">
                {stat.label}
              </div>
              <div style={{ color: theme.textPrimary }} className="mt-3 text-3xl font-display tracking-tight">
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{ backgroundColor: theme.bgApp, borderColor: theme.border }}
          className="rounded-xl border p-6 text-center"
        >
          <div className="mb-2 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>
          <h2 style={{ color: theme.textPrimary }} className="text-xl font-medium tracking-tight">
            No activity yet
          </h2>
          <p style={{ color: theme.textSecondary }} className="mt-2 text-sm leading-6">
            Analytics and recent customer activity will appear once you add real customers, purchases, and loyalty data.
          </p>
        </div>
      </div>

      <div
        style={{ backgroundColor: theme.bgSurface, borderColor: theme.border }}
        className="rounded-xl border p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div style={{ color: theme.textSecondary }} className="text-[11px] uppercase tracking-[0.08em] font-semibold">
              Recent activity
            </div>
            <h3 style={{ color: theme.textPrimary }} className="mt-1 text-lg font-medium">
              No recent activity
            </h3>
          </div>
        </div>
        <p style={{ color: theme.textSecondary }} className="mt-3 text-sm leading-6">
          Customer and transaction events will appear here after real data is created in your business.
        </p>
      </div>
    </div>
  );
};

