/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const CampaignsPage: React.FC = () => {
  const { theme } = useTheme();

  const campaigns = [
    {
      title: 'We miss you (30 days)',
      description: 'Invites guests back with a 50-point bonus if they have not visited in 30 days.',
      status: 'Active',
      impact: '24% return rate',
    },
    {
      title: 'Birthday perk',
      description: 'Complimentary dessert voucher automatically sent on guest birth date.',
      status: 'Active',
      impact: '68% redemption',
    },
    {
      title: 'Weekend tasting event',
      description: 'Exclusive invitation for top 100 VIP tier members.',
      status: 'Scheduled',
      impact: '100 invitations',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-12 py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1
            style={{ color: theme.textPrimary }}
            className="text-2xl sm:text-3xl font-display font-medium tracking-[-0.03em]"
          >
            Campaigns
          </h1>
          <p style={{ color: theme.textSecondary }} className="text-[14px]">
            Targeted retention messages to bring guests back to your doors.
          </p>
        </div>

        <button
          style={{
            backgroundColor: theme.accent,
            color: theme.accentText,
          }}
          className="py-2.5 px-4 hover:opacity-90 active:opacity-95 rounded-lg text-[13px] font-medium transition-opacity cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0"
        >
          New campaign
        </button>
      </div>

      {/* Editorial Campaign List */}
      <div
        style={{ borderColor: theme.border }}
        className="divide-y divide-[#F5F4F0] border-t border-b"
      >
        {campaigns.map((camp, idx) => (
          <div
            key={idx}
            className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 hover:bg-black/2 transition-colors px-1"
          >
            <div className="space-y-1 max-w-lg">
              <div className="flex items-baseline gap-3">
                <span
                  style={{ color: theme.textPrimary }}
                  className="text-[16px] font-medium"
                >
                  {camp.title}
                </span>
                <span
                  style={{
                    color: camp.status === 'Active' ? theme.badgeGreenText : theme.textSecondary,
                  }}
                  className="text-[12px] font-medium"
                >
                  {camp.status}
                </span>
              </div>
              <p
                style={{ color: theme.textSecondary }}
                className="text-[13px] leading-relaxed"
              >
                {camp.description}
              </p>
            </div>

            <div className="sm:text-right shrink-0">
              <span
                style={{ color: theme.textPrimary }}
                className="text-[13px] font-medium block"
              >
                {camp.impact}
              </span>
              <span style={{ color: theme.textMuted }} className="text-[11px] block mt-0.5">
                Outcome
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
