/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { RewardItem } from '../types/loyalty';
import { useTheme } from '../context/ThemeContext';

export const RewardsPage: React.FC = () => {
  const { theme } = useTheme();
  const [rewards, setRewards] = useState<RewardItem[]>([
    {
      id: 'rew-1',
      title: '₹100 OFF',
      description: 'Redeemable reward on orders above ₹500',
      pointsCost: 500,
      discountType: 'FLAT',
      discountValue: 100,
      status: 'ACTIVE',
      redemptionCount: 142,
    },
    {
      id: 'rew-2',
      title: 'FREE DESSERT',
      description: 'Redeemable artisanal pastry or cheesecake',
      pointsCost: 750,
      discountType: 'FREE_ITEM',
      status: 'ACTIVE',
      redemptionCount: 88,
    },
    {
      id: 'rew-3',
      title: '10% OFF',
      description: 'Redeemable reward on entire bill',
      pointsCost: 1000,
      discountType: 'PERCENT',
      discountValue: 10,
      status: 'ACTIVE',
      redemptionCount: 215,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState('500');
  const [desc, setDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setRewards([
      {
        id: `rew-${Date.now()}`,
        title: title.trim().toUpperCase(),
        description: desc.trim() || 'Redeemable store reward',
        pointsCost: parseInt(points) || 500,
        discountType: 'FLAT',
        status: 'ACTIVE',
        redemptionCount: 0,
      },
      ...rewards,
    ]);

    setTitle('');
    setPoints('500');
    setDesc('');
    setShowModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-12 py-10 space-y-12">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1
            style={{ color: theme.textPrimary }}
            className="text-2xl sm:text-3xl font-display font-medium tracking-[-0.03em]"
          >
            Rewards catalog
          </h1>
          <p style={{ color: theme.textSecondary }} className="text-[14px]">
            Incentives that encourage repeat dining and retail visits.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            backgroundColor: theme.accent,
            color: theme.accentText,
          }}
          className="py-2.5 px-4 hover:opacity-90 active:opacity-95 rounded-lg text-[13px] font-medium transition-opacity cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0"
        >
          + Create reward
        </button>
      </div>

      {/* Rewards Catalog - High End Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {rewards.map(r => (
          <div
            key={r.id}
            style={{
              backgroundColor: theme.bgSurface,
              borderColor: theme.border,
            }}
            className="rounded-xl border p-7 flex flex-col justify-between space-y-8 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)]"
          >
            <div className="space-y-3">
              <span
                style={{ color: theme.textMuted }}
                className="text-[11px] font-medium uppercase tracking-[0.08em] block"
              >
                Store Perk
              </span>
              <h2
                style={{ color: theme.textPrimary }}
                className="text-2xl font-display font-medium tracking-tight"
              >
                {r.title}
              </h2>
              <p
                style={{ color: theme.textSecondary }}
                className="text-[13px] leading-relaxed"
              >
                {r.description}
              </p>
            </div>

            <div
              style={{ borderColor: theme.borderSubtle }}
              className="pt-6 border-t flex items-baseline justify-between"
            >
              <div>
                <span
                  style={{ color: theme.textPrimary }}
                  className="text-2xl font-display font-light block"
                >
                  {r.pointsCost}
                </span>
                <span
                  style={{ color: theme.textMuted }}
                  className="text-[11px] uppercase tracking-wider block"
                >
                  Points required
                </span>
              </div>

              <div className="text-right">
                <span
                  style={{ color: theme.textSecondary }}
                  className="text-[12px] block"
                >
                  {r.redemptionCount} redeemed
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Reward Dialog */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div
            style={{
              backgroundColor: theme.bgSurface,
              borderColor: theme.border,
            }}
            className="rounded-xl border shadow-[0_12px_36px_rgba(0,0,0,0.08)] max-w-sm w-full p-6 space-y-5"
          >
            <div className="flex items-center justify-between pb-1">
              <span
                style={{ color: theme.textPrimary }}
                className="text-[15px] font-medium"
              >
                Create reward
              </span>
              <button
                onClick={() => setShowModal(false)}
                style={{ color: theme.textMuted }}
                className="hover:opacity-80"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Reward Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹150 OFF or FREE COFFEE"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Points to Redeem
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  required
                  value={points}
                  onChange={e => setPoints(e.target.value)}
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Conditions / Description
                </label>
                <input
                  type="text"
                  placeholder="Valid on dining orders above ₹600"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  style={{
                    backgroundColor: theme.accent,
                    color: theme.accentText,
                  }}
                  className="w-full py-2.5 px-4 hover:opacity-90 active:opacity-95 rounded-lg text-[13px] font-medium transition-opacity cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  Save reward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
