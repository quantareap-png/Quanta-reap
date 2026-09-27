/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const InsightsPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-12 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-1 pb-2">
        <h1
          style={{ color: theme.textPrimary }}
          className="text-2xl sm:text-3xl font-display font-medium tracking-[-0.03em]"
        >
          Insights
        </h1>
        <p style={{ color: theme.textSecondary }} className="text-[14px]">
          Cohort analytics and visit frequency benchmarks for your store.
        </p>
      </div>

      {/* Editorial Key Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div className="space-y-2">
          <div
            style={{ color: theme.textMuted }}
            className="text-[11px] font-medium uppercase tracking-[0.08em]"
          >
            Visit frequency
          </div>
          <div
            style={{ color: theme.textPrimary }}
            className="text-4xl font-display font-light"
          >
            2.8x
          </div>
          <p style={{ color: theme.textSecondary }} className="text-[13px]">
            Visits per member each month, compared to 1.4x for non-members.
          </p>
        </div>

        <div className="space-y-2">
          <div
            style={{ color: theme.textMuted }}
            className="text-[11px] font-medium uppercase tracking-[0.08em]"
          >
            Average ticket
          </div>
          <div
            style={{ color: theme.textPrimary }}
            className="text-4xl font-display font-light"
          >
            ₹740
          </div>
          <p style={{ color: theme.textSecondary }} className="text-[13px]">
            +42% larger basket size when customers redeem or accumulate points.
          </p>
        </div>

        <div className="space-y-2">
          <div
            style={{ color: theme.textMuted }}
            className="text-[11px] font-medium uppercase tracking-[0.08em]"
          >
            Redemption rate
          </div>
          <div
            style={{ color: theme.textPrimary }}
            className="text-4xl font-display font-light"
          >
            68%
          </div>
          <p style={{ color: theme.textSecondary }} className="text-[13px]">
            Active point burn cycle showing high member engagement.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: theme.border }} className="h-px w-full" />

      {/* Benchmark summary */}
      <div className="space-y-3">
        <span
          style={{ color: theme.textMuted }}
          className="text-[11px] font-medium uppercase tracking-[0.08em] block"
        >
          Benchmark analysis
        </span>
        <p
          style={{ color: theme.textSecondary }}
          className="text-[14px] max-w-xl leading-relaxed"
        >
          Your store ranks in the top 10% of local venues for guest return speed. Repeat diners return within 12 days on average.
        </p>
      </div>
    </div>
  );
};
