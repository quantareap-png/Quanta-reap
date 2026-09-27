/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LoyaltyPage: React.FC = () => {
  const { currentBusiness } = useAuth();
  const { theme } = useTheme();
  const [pointsPerUnit, setPointsPerUnit] = useState<number>(5);
  const [currencyUnit, setCurrencyUnit] = useState<number>(100);
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-12 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-1 pb-2">
        <h1
          style={{ color: theme.textPrimary }}
          className="text-2xl sm:text-3xl font-display font-medium tracking-[-0.03em]"
        >
          Loyalty
        </h1>
        <p style={{ color: theme.textSecondary }} className="text-[14px]">
          Give customers a reason to come back.
        </p>
      </div>

      {/* Program Status Hero */}
      <div className="space-y-3">
        <div className="flex items-baseline gap-3">
          <span
            style={{ color: theme.textPrimary }}
            className="text-2xl font-display font-medium"
          >
            {currentBusiness?.name || 'Store'} Rewards
          </span>
          <span
            style={{ color: theme.badgeGreenText }}
            className="text-[13px] font-medium"
          >
            Program active
          </span>
        </div>
        <p style={{ color: theme.textSecondary }} className="text-[14px]">
          0 registered members yet. Your loyalty program will fill with real customer activity as soon as you start creating data.
        </p>
      </div>

      <div style={{ backgroundColor: theme.border }} className="h-px w-full" />

      {/* Program Earning Rule in Plain English */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span
            style={{ color: theme.textMuted }}
            className="text-[11px] font-medium uppercase tracking-[0.08em] block"
          >
            Your earning rule
          </span>
          <div className="pt-2 flex items-baseline gap-4">
            <span
              style={{ color: theme.textPrimary }}
              className="text-4xl sm:text-5xl font-display font-light"
            >
              ₹{currencyUnit} spent &rarr; {pointsPerUnit} points
            </span>
          </div>
          <p style={{ color: theme.textSecondary }} className="text-[14px] pt-1">
            Customers receive {pointsPerUnit} points for every ₹{currencyUnit} spent on dining or goods.
          </p>
        </div>

        {isEditing ? (
          <form
            onSubmit={handleSave}
            style={{
              backgroundColor: theme.bgSurface,
              borderColor: theme.border,
            }}
            className="p-6 border rounded-xl space-y-5 max-w-lg shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Spend Step (₹)
                </label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={currencyUnit}
                  onChange={e => setCurrencyUnit(parseInt(e.target.value) || 100)}
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  className="w-full px-3 py-2 text-[14px] font-display font-medium border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Points Earned
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={pointsPerUnit}
                  onChange={e => setPointsPerUnit(parseInt(e.target.value) || 5)}
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  className="w-full px-3 py-2 text-[14px] font-display font-medium border rounded-lg focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                style={{
                  backgroundColor: theme.accent,
                  color: theme.accentText,
                }}
                className="py-2 px-4 hover:opacity-90 active:opacity-95 rounded-lg text-[13px] font-medium transition-opacity cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                Save rule
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{ color: theme.textSecondary }}
                className="py-2 px-3 hover:opacity-80 text-[13px] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEditing(true)}
              style={{ color: theme.textPrimary }}
              className="text-[13px] hover:underline font-medium cursor-pointer"
            >
              Edit rule
            </button>
            {savedSuccess && (
              <span
                style={{ color: theme.badgeGreenText }}
                className="text-[13px] font-medium"
              >
                ✓ Earning rule updated
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ backgroundColor: theme.border }} className="h-px w-full" />

      {/* Program Guidance */}
      <div className="space-y-3">
        <span
          style={{ color: theme.textMuted }}
          className="text-[11px] font-medium uppercase tracking-[0.08em] block"
        >
          Guidance
        </span>
        <p
          style={{ color: theme.textSecondary }}
          className="text-[14px] max-w-xl leading-relaxed"
        >
          Keep earning simple. When rules are easy to explain at the counter, customers are 3x more likely to return within 14 days.
        </p>
      </div>
    </div>
  );
};
