/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const HelpPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-12 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-1 pb-2">
        <h1
          style={{ color: theme.textPrimary }}
          className="text-2xl sm:text-3xl font-display font-medium tracking-[-0.03em]"
        >
          Help & Guides
        </h1>
        <p style={{ color: theme.textSecondary }} className="text-[14px]">
          Guidance for training staff and running your loyalty program smoothly.
        </p>
      </div>

      {/* Editorial Guidance */}
      <div
        style={{ borderColor: theme.border }}
        className="space-y-10 divide-y divide-[#F5F4F0]"
      >
        <div className="pt-2 space-y-2">
          <h2
            style={{ color: theme.textPrimary }}
            className="text-[17px] font-medium"
          >
            How points earning works
          </h2>
          <p
            style={{ color: theme.textSecondary }}
            className="text-[14px] max-w-2xl leading-relaxed"
          >
            Quanta defaults to awarding 5 points for every ₹100 spent. When staff record a purchase, the customer's balance updates in real time without requiring them to install an app or present a plastic card.
          </p>
        </div>

        <div className="pt-8 space-y-2">
          <h2
            style={{ color: theme.textPrimary }}
            className="text-[17px] font-medium"
          >
            Fast customer checkout
          </h2>
          <p
            style={{ color: theme.textSecondary }}
            className="text-[14px] max-w-2xl leading-relaxed"
          >
            Staff only need a customer's 10-digit mobile number or name. Guests receive immediate SMS or WhatsApp confirmations of their points balance, motivating them to return.
          </p>
        </div>

        <div className="pt-8 space-y-2">
          <h2
            style={{ color: theme.textPrimary }}
            className="text-[17px] font-medium"
          >
            Staff onboarding tips
          </h2>
          <p
            style={{ color: theme.textSecondary }}
            className="text-[14px] max-w-2xl leading-relaxed"
          >
            Keep the "+ Add Purchase" screen open or bookmarked on your register tablet or phone. Entering a transaction takes fewer than 5 seconds.
          </p>
        </div>
      </div>
    </div>
  );
};
