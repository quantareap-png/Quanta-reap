/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEME_PALETTES, ThemePaletteId } from '../context/ThemeContext';
import { SecurityTestsPage } from './SecurityTestsPage';
import { DiagnosticsPage } from './DiagnosticsPage';
import { DashboardPage as AdminLegacyDashboard } from './DashboardPage';
import { Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentBusiness } = useAuth();
  const { theme, themeId, setThemeId } = useTheme();
  const [activeSection, setActiveSection] = useState<'profile' | 'appearance' | 'security' | 'diagnostics'>('appearance');

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-12 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-1 pb-2">
        <h1
          style={{ color: theme.textPrimary }}
          className="text-2xl sm:text-3xl font-display font-medium tracking-[-0.03em]"
        >
          Settings
        </h1>
        <p style={{ color: theme.textSecondary }} className="text-[14px]">
          Manage your store appearance, business profile, staff access, and developer tools.
        </p>
      </div>

      {/* Navigation Sub-Links */}
      <div
        style={{ borderColor: theme.border }}
        className="flex items-center gap-6 border-b pb-3 text-[13px] overflow-x-auto"
      >
        <button
          onClick={() => setActiveSection('appearance')}
          style={{
            color: activeSection === 'appearance' ? theme.textPrimary : theme.textSecondary,
            borderBottomColor: activeSection === 'appearance' ? theme.textPrimary : 'transparent',
          }}
          className={`cursor-pointer transition-colors pb-1 border-b-2 font-medium shrink-0`}
        >
          Appearance & Colors
        </button>

        <button
          onClick={() => setActiveSection('profile')}
          style={{
            color: activeSection === 'profile' ? theme.textPrimary : theme.textSecondary,
            borderBottomColor: activeSection === 'profile' ? theme.textPrimary : 'transparent',
          }}
          className={`cursor-pointer transition-colors pb-1 border-b-2 font-medium shrink-0`}
        >
          Business profile
        </button>

        <button
          onClick={() => setActiveSection('security')}
          style={{
            color: activeSection === 'security' ? theme.textPrimary : theme.textSecondary,
            borderBottomColor: activeSection === 'security' ? theme.textPrimary : 'transparent',
          }}
          className={`cursor-pointer transition-colors pb-1 border-b-2 font-medium shrink-0`}
        >
          Security & Tenant Isolation
        </button>

        <button
          onClick={() => setActiveSection('diagnostics')}
          style={{
            color: activeSection === 'diagnostics' ? theme.textPrimary : theme.textSecondary,
            borderBottomColor: activeSection === 'diagnostics' ? theme.textPrimary : 'transparent',
          }}
          className={`cursor-pointer transition-colors pb-1 border-b-2 font-medium shrink-0`}
        >
          Developer & Diagnostics
        </button>
      </div>

      {/* Views */}
      <div>
        {activeSection === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3
                style={{ color: theme.textPrimary }}
                className="text-[16px] font-medium"
              >
                Color Atmosphere
              </h3>
              <p style={{ color: theme.textSecondary }} className="text-[13px] mt-0.5">
                Choose a bespoke palette tailored to your venue's aesthetic personality.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {(Object.keys(THEME_PALETTES) as ThemePaletteId[]).map(id => {
                const pal = THEME_PALETTES[id];
                const isSelected = themeId === id;
                return (
                  <button
                    key={id}
                    onClick={() => setThemeId(id)}
                    style={{
                      backgroundColor: isSelected ? pal.bgSubtle : pal.bgSurface,
                      borderColor: isSelected ? pal.accent : pal.border,
                    }}
                    className="p-5 rounded-xl border-2 text-left flex flex-col justify-between space-y-4 hover:opacity-95 transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 inline-block shadow-2xs"
                          style={{ backgroundColor: pal.previewColor }}
                        />
                        <span
                          style={{ color: pal.textPrimary }}
                          className="font-medium text-[15px]"
                        >
                          {pal.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div
                          style={{ backgroundColor: pal.accent, color: pal.accentText }}
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    <p style={{ color: pal.textSecondary }} className="text-[12px] leading-relaxed">
                      {pal.description}
                    </p>

                    {/* Color Swatch Bar */}
                    <div className="flex items-center gap-1.5 pt-2">
                      <span className="w-5 h-5 rounded-md border" style={{ backgroundColor: pal.bgApp, borderColor: pal.border }} title="Background" />
                      <span className="w-5 h-5 rounded-md border" style={{ backgroundColor: pal.bgSurface, borderColor: pal.border }} title="Surface" />
                      <span className="w-5 h-5 rounded-md border" style={{ backgroundColor: pal.bgSubtle, borderColor: pal.border }} title="Subtle" />
                      <span className="w-5 h-5 rounded-md" style={{ backgroundColor: pal.accent }} title="Accent" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <span
                style={{ color: theme.textMuted }}
                className="text-[11px] font-medium uppercase tracking-[0.08em] block"
              >
                Store details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-[13px]">
                <div>
                  <span style={{ color: theme.textMuted }} className="block text-[11px] uppercase tracking-wider">
                    Business Name
                  </span>
                  <span
                    style={{ color: theme.textPrimary }}
                    className="font-medium text-[15px] mt-0.5 block"
                  >
                    {currentBusiness?.name}
                  </span>
                </div>
                <div>
                  <span style={{ color: theme.textMuted }} className="block text-[11px] uppercase tracking-wider">
                    Type
                  </span>
                  <span
                    style={{ color: theme.textPrimary }}
                    className="font-medium text-[15px] mt-0.5 block"
                  >
                    {currentBusiness?.businessType}
                  </span>
                </div>
                <div>
                  <span style={{ color: theme.textMuted }} className="block text-[11px] uppercase tracking-wider">
                    Currency
                  </span>
                  <span
                    style={{ color: theme.textSecondary }}
                    className="mt-0.5 block font-mono"
                  >
                    {currentBusiness?.currency || 'INR (₹)'}
                  </span>
                </div>
                <div>
                  <span style={{ color: theme.textMuted }} className="block text-[11px] uppercase tracking-wider">
                    Timezone
                  </span>
                  <span
                    style={{ color: theme.textSecondary }}
                    className="mt-0.5 block font-mono"
                  >
                    {currentBusiness?.timezone || 'Asia/Kolkata'}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: theme.border }} className="h-px w-full" />

            <div className="space-y-3">
              <span
                style={{ color: theme.textMuted }}
                className="text-[11px] font-medium uppercase tracking-[0.08em] block"
              >
                Staff & Membership
              </span>
              <AdminLegacyDashboard />
            </div>
          </div>
        )}

        {activeSection === 'security' && (
          <div className="space-y-4">
            <p style={{ color: theme.textSecondary }} className="text-[13px]">
              Automated tests verifying DynamoDB single-table tenant isolation boundaries and cryptographic session tokens.
            </p>
            <SecurityTestsPage />
          </div>
        )}

        {activeSection === 'diagnostics' && (
          <div className="space-y-4">
            <p style={{ color: theme.textSecondary }} className="text-[13px]">
              Engineering diagnostic stream, audit logs, and module status.
            </p>
            <DiagnosticsPage />
          </div>
        )}
      </div>
    </div>
  );
};
