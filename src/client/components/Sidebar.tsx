/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export type NavItemKey =
  | 'overview'
  | 'customers'
  | 'loyalty'
  | 'rewards'
  | 'campaigns'
  | 'insights'
  | 'settings'
  | 'help';

interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAddPurchase: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  onOpenAddPurchase,
}) => {
  const { currentBusiness } = useAuth();
  const { theme } = useTheme();

  const primaryNav = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'customers' as const, label: 'Customers' },
    { key: 'loyalty' as const, label: 'Loyalty' },
    { key: 'rewards' as const, label: 'Rewards' },
    { key: 'campaigns' as const, label: 'Campaigns' },
    { key: 'insights' as const, label: 'Insights' },
  ];

  const secondaryNav = [
    { key: 'settings' as const, label: 'Settings' },
    { key: 'help' as const, label: 'Help' },
  ];

  const handleNavClick = (key: NavItemKey) => {
    onSelectTab(key);
    onCloseMobile();
  };

  const navContent = (
    <div
      style={{
        backgroundColor: theme.bgSidebar,
        borderColor: theme.border,
        color: theme.textPrimary,
      }}
      className="flex flex-col h-full border-r select-none transition-colors"
    >
      {/* Brand Header */}
      <div className="pt-7 pb-6 px-6">
        <div className="tracking-tight">
          <div className="flex items-center justify-between">
            <span
              style={{ color: theme.textPrimary }}
              className="font-display font-semibold text-lg tracking-[-0.03em] block"
            >
              QUANTA
            </span>
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: theme.accentGreen }}
              title="System active"
            />
          </div>
          <span
            style={{ color: theme.textSecondary }}
            className="text-[12px] font-normal tracking-normal mt-0.5 block"
          >
            Customer loyalty
          </span>
        </div>
      </div>

      {/* Primary Action Button: Add Purchase */}
      <div className="px-5 mb-6">
        <button
          id="sidebar-add-purchase-btn"
          onClick={() => {
            onOpenAddPurchase();
            onCloseMobile();
          }}
          style={{
            backgroundColor: theme.accent,
            color: theme.accentText,
          }}
          className="w-full py-2.5 px-3.5 rounded-lg text-[13px] font-medium transition-all hover:opacity-95 active:scale-[0.99] flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.1)] cursor-pointer group"
        >
          <span className="font-medium tracking-tight">Add Purchase</span>
          <span className="text-base font-light opacity-75 group-hover:opacity-100 transition-opacity">
            +
          </span>
        </button>
      </div>

      {/* Main Editorial Navigation */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto">
        {primaryNav.map(item => {
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              id={`sidebar-nav-${item.key}`}
              onClick={() => handleNavClick(item.key)}
              style={{
                backgroundColor: isActive ? theme.bgSurface : 'transparent',
                color: isActive ? theme.textPrimary : theme.textSecondary,
                fontWeight: isActive ? 600 : 400,
                boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-all text-left cursor-pointer hover:bg-black/4"
            >
              <span>{item.label}</span>
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
              )}
            </button>
          );
        })}

        <div className="pt-6 pb-2 px-3">
          <div style={{ backgroundColor: theme.border }} className="h-px w-full opacity-60" />
        </div>

        {secondaryNav.map(item => {
          const isActive = currentTab === item.key;
          return (
            <button
              key={item.key}
              id={`sidebar-nav-${item.key}`}
              onClick={() => handleNavClick(item.key)}
              style={{
                backgroundColor: isActive ? theme.bgSurface : 'transparent',
                color: isActive ? theme.textPrimary : theme.textMuted,
                fontWeight: isActive ? 600 : 400,
                boxShadow: isActive ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-all text-left cursor-pointer hover:bg-black/4"
            >
              <span>{item.label}</span>
              {isActive && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: theme.accent }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Business Profile Bottom Section */}
      <div
        style={{ borderColor: theme.border }}
        className="p-5 border-t"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col min-w-0 pr-2">
            <span
              style={{ color: theme.textPrimary }}
              className="text-[13px] font-medium truncate leading-tight"
            >
              {currentBusiness?.name || 'No business configured'}
            </span>
            <span
              style={{ color: theme.textSecondary }}
              className="text-[11px] mt-0.5 truncate"
            >
              {currentBusiness?.businessType || 'Awaiting setup'}
            </span>
          </div>
          <span
            style={{
              backgroundColor: theme.accentGreenBg,
              color: theme.accentGreen,
            }}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 tracking-tight"
          >
            Active
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 h-screen sticky top-0 z-20">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-stone-900/20 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div
            style={{ backgroundColor: theme.bgApp }}
            className="fixed inset-y-0 left-0 w-64 max-w-full shadow-lg z-10 flex flex-col"
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
