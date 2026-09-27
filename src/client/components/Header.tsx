/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Building2,
  LogOut,
  Activity,
  CheckCircle2,
  ChevronDown,
  Users,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'customers' | 'tests' | 'diagnostics';
  onSelectTab: (tab: 'dashboard' | 'customers' | 'tests' | 'diagnostics') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab }) => {
  const { user, currentBusiness, businesses, switchBusiness, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'platform_admin':
        return { label: 'Platform Admin', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'business_owner':
        return { label: 'Owner', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'business_manager':
        return { label: 'Manager', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'business_staff':
        return { label: 'Staff', bg: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: role || 'Member', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const badge = getRoleBadge(currentBusiness?.role);

  return (
    <header id="quanta-header" className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Identity */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white font-extrabold text-base shadow-sm ring-1 ring-slate-900/10">
                Q
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold tracking-tight text-slate-900 font-display">Quanta</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    Verified Tenant
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Loyalty &amp; Retention Platform
                </div>
              </div>
            </div>

            {/* Primary Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-slate-200/80">
              <button
                id="nav-tab-dashboard"
                onClick={() => onSelectTab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'dashboard'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${currentTab === 'dashboard' ? 'text-white' : 'text-slate-500'}`} />
                Business Hub
              </button>

              <button
                id="nav-tab-customers"
                onClick={() => onSelectTab('customers')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'customers'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Users className={`w-3.5 h-3.5 ${currentTab === 'customers' ? 'text-white' : 'text-blue-600'}`} />
                Customers
              </button>

              <button
                id="nav-tab-tests"
                onClick={() => onSelectTab('tests')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'tests'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${currentTab === 'tests' ? 'text-white' : 'text-emerald-600'}`} />
                Security Suite
              </button>

              <button
                id="nav-tab-diagnostics"
                onClick={() => onSelectTab('diagnostics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  currentTab === 'diagnostics'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Activity className={`w-3.5 h-3.5 ${currentTab === 'diagnostics' ? 'text-white' : 'text-purple-600'}`} />
                Diagnostics
              </button>
            </nav>
          </div>

          {/* User & Tenant Context */}
          <div className="flex items-center space-x-3">
            {/* Business Context Selector with Dropdown */}
            {currentBusiness && (
              <div className="relative" ref={dropdownRef}>
                <button
                  id="business-switcher-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-xl px-3 py-1.5 transition-colors text-left"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                    {currentBusiness.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Store</div>
                    <div className="text-xs font-bold text-slate-800 leading-tight">{currentBusiness.name}</div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                      Switch Business Entity
                    </div>
                    {businesses.map(b => (
                      <button
                        key={b.id}
                        onClick={() => {
                          switchBusiness(b.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          b.id === currentBusiness.id
                            ? 'font-bold text-emerald-800 bg-emerald-50/60'
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <div>{b.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal capitalize">{b.role.replace('_', ' ')}</div>
                        </div>
                        {b.id === currentBusiness.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Authenticated User */}
            {user && (
              <div className="flex items-center space-x-2 pl-1">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</div>
                  <span
                    className={`inline-block text-[10px] px-2 py-0.2 rounded-full border font-bold mt-0.5 ${badge.bg}`}
                  >
                    {badge.label}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              id="header-logout-btn"
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden space-x-1 py-2 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              currentTab === 'dashboard' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Business Hub
          </button>
          <button
            onClick={() => onSelectTab('customers')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              currentTab === 'customers' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => onSelectTab('tests')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              currentTab === 'tests' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Security Tests
          </button>
          <button
            onClick={() => onSelectTab('diagnostics')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              currentTab === 'diagnostics' ? 'bg-slate-900 text-white' : 'text-slate-600'
            }`}
          >
            Diagnostics
          </button>
        </div>
      </div>
    </header>
  );
};
