/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme, THEME_PALETTES, ThemePaletteId } from '../context/ThemeContext';
import {
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Check,
  Palette,
} from 'lucide-react';

interface TopBarProps {
  pageTitle: string;
  onOpenMobileMenu: () => void;
  onGlobalSearch?: (query: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  pageTitle,
  onOpenMobileMenu,
  onGlobalSearch,
}) => {
  const { user, currentBusiness, businesses, switchBusiness, logout } = useAuth();
  const { theme, themeId, setThemeId } = useTheme();
  const [bizDropdownOpen, setBizDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const bizRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bizRef.current && !bizRef.current.contains(event.target as Node)) {
        setBizDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
        setThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (onGlobalSearch) onGlobalSearch(e.target.value);
  };

  return (
    <header
      style={{
        backgroundColor: theme.bgSurface,
        borderColor: theme.border,
      }}
      className="h-16 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-20 border-b transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
    >
      {/* Left: Mobile trigger + Clean editorial Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          style={{ color: theme.textSecondary }}
          className="p-1.5 -ml-1.5 rounded-md hover:text-[#1C1917] lg:hidden cursor-pointer"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5 stroke-[1.5]" />
        </button>
        <span
          style={{ color: theme.textPrimary }}
          className="text-[17px] font-medium tracking-tight"
        >
          {pageTitle}
        </span>
      </div>

      {/* Right Controls: Color palette picker, minimal search, notifications, business switcher, profile */}
      <div className="flex items-center gap-4 sm:gap-6 text-[13px]">
        {/* Color Palette Switcher */}
        <div className="relative" ref={themeRef}>
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            style={{ color: theme.textSecondary }}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer py-1"
            title="Choose Color Atmosphere"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block shrink-0 shadow-2xs"
              style={{ backgroundColor: theme.previewColor }}
            />
            <span className="hidden sm:inline text-xs font-normal">
              {theme.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 opacity-60 stroke-[1.5]" />
          </button>

          {themeDropdownOpen && (
            <div
              style={{
                backgroundColor: theme.bgSurface,
                borderColor: theme.border,
              }}
              className="absolute right-0 mt-2 w-64 border rounded-xl shadow-lg py-2 z-50 text-[13px]"
            >
              <div
                style={{ color: theme.textMuted }}
                className="px-3.5 py-1 text-[11px] font-medium uppercase tracking-wider"
              >
                Color Atmosphere
              </div>
              {(Object.keys(THEME_PALETTES) as ThemePaletteId[]).map(id => {
                const pal = THEME_PALETTES[id];
                const isSelected = themeId === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setThemeId(id);
                      setThemeDropdownOpen(false);
                    }}
                    style={{
                      backgroundColor: isSelected ? theme.bgSubtle : 'transparent',
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                        style={{ backgroundColor: pal.previewColor }}
                      />
                      <div className="min-w-0">
                        <div
                          style={{
                            color: isSelected ? theme.textPrimary : theme.textSecondary,
                            fontWeight: isSelected ? 600 : 400,
                          }}
                          className="truncate leading-tight text-xs"
                        >
                          {pal.name}
                        </div>
                        <div
                          style={{ color: theme.textMuted }}
                          className="text-[10px] truncate mt-0.5"
                        >
                          {pal.description}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check
                        style={{ color: theme.textPrimary }}
                        className="w-3.5 h-3.5 stroke-[2] shrink-0 ml-2"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Subtle Search */}
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onBlur={() => {
                  if (!searchQuery) setSearchOpen(false);
                }}
                placeholder="Search customer, phone..."
                style={{
                  color: theme.textPrimary,
                  borderBottomColor: theme.textPrimary,
                }}
                className="w-40 sm:w-56 px-2 py-1 text-[13px] bg-transparent border-b placeholder-[#A8A29E] focus:outline-hidden"
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              style={{ color: theme.textSecondary }}
              className="hover:opacity-80 transition-opacity flex items-center gap-1.5 cursor-pointer py-1"
            >
              <Search className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden sm:inline text-xs">Search</span>
            </button>
          )}
        </div>

        {/* Quiet Notifications */}
        <button
          style={{ color: theme.textSecondary }}
          className="hover:opacity-80 transition-opacity cursor-pointer py-1 relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4 stroke-[1.5]" />
          <span
            style={{ backgroundColor: theme.badgeGreenText }}
            className="w-1.5 h-1.5 rounded-full absolute top-1 right-0"
          />
        </button>

        {/* Business Switcher - Understated Text Link */}
        {currentBusiness && (
          <div className="relative" ref={bizRef}>
            <button
              id="topbar-biz-switcher-btn"
              onClick={() => setBizDropdownOpen(!bizDropdownOpen)}
              style={{ color: theme.textSecondary }}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer py-1 font-normal text-xs"
            >
              <span className="max-w-[120px] truncate">{currentBusiness.name}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 stroke-[1.5]" />
            </button>

            {bizDropdownOpen && (
              <div
                style={{
                  backgroundColor: theme.bgSurface,
                  borderColor: theme.border,
                }}
                className="absolute right-0 mt-2 w-56 border rounded-xl shadow-lg py-1.5 z-50 text-[13px]"
              >
                <div
                  style={{ color: theme.textMuted }}
                  className="px-3.5 py-1 text-[11px] font-medium uppercase tracking-wider"
                >
                  Locations & Stores
                </div>
                {businesses.map(b => (
                  <button
                    key={b.id}
                    onClick={() => {
                      switchBusiness(b.id);
                      setBizDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-black/5 transition-colors cursor-pointer"
                  >
                    <span
                      style={{
                        color: b.id === currentBusiness.id ? theme.textPrimary : theme.textSecondary,
                        fontWeight: b.id === currentBusiness.id ? 600 : 400,
                      }}
                      className="truncate text-xs"
                    >
                      {b.name}
                    </span>
                    {b.id === currentBusiness.id && (
                      <Check
                        style={{ color: theme.textPrimary }}
                        className="w-3.5 h-3.5 stroke-[2]"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Profile Avatar */}
        {user && (
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              style={{
                backgroundColor: theme.bgSubtle,
                color: theme.textPrimary,
                borderColor: theme.border,
              }}
              className="w-7 h-7 rounded-full border flex items-center justify-center font-medium text-[11px] hover:opacity-90 transition-opacity cursor-pointer"
              title={user.name}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </button>

            {userDropdownOpen && (
              <div
                style={{
                  backgroundColor: theme.bgSurface,
                  borderColor: theme.border,
                }}
                className="absolute right-0 mt-2 w-48 border rounded-xl shadow-lg py-1 z-50 text-[13px]"
              >
                <div
                  style={{ borderColor: theme.borderSubtle }}
                  className="px-3.5 py-2 border-b"
                >
                  <div style={{ color: theme.textPrimary }} className="font-medium text-xs">
                    {user.name}
                  </div>
                  <div style={{ color: theme.textMuted }} className="text-[11px] truncate mt-0.5">
                    {user.email}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3.5 py-2 text-rose-700 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer text-xs"
                >
                  <LogOut className="w-3.5 h-3.5 stroke-[1.5]" />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
