/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, Lock, Mail, Users, ArrowRight } from 'lucide-react';
import { DEMO_ACCOUNTS } from '../../db/seed-data';

interface LoginPageProps {
  onNavigateRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateRegister }) => {
  const { login, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLocalError(null);
    clearError();

    try {
      setLoading(true);
      await login(demoEmail, demoPass);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/50 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/80 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
            Q
          </div>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-display">
          Welcome to Quanta
        </h2>
        <p className="mt-1.5 text-xs text-slate-600 max-w-sm mx-auto">
          Customer Loyalty, Retention &amp; Engagement Platform for Local Businesses
        </p>
      </div>

      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl sm:px-9">
          {activeError && (
            <div
              id="login-error-alert"
              className="mb-5 p-3.5 rounded-xl bg-red-50/80 border border-red-200 text-red-700 text-xs flex items-start gap-2.5"
            >
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-red-900">Authentication Failed</div>
                <div className="text-red-700 text-[11px] mt-0.5">{activeError}</div>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Work Email
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder-slate-400 transition-all outline-hidden"
                  placeholder="name@business.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder-slate-400 transition-all outline-hidden"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-xs text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-60 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in securely...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign in to Business</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New to Quanta?{' '}
              <button
                id="goto-register-btn"
                onClick={onNavigateRegister}
                className="font-semibold text-slate-900 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors"
              >
                Create business account
                <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          </div>
        </div>

        {/* Demo Tenancy Accounts Quick Picker */}
        <div className="mt-5 bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>1-Click Verified Demo Access</span>
            </div>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Ready to Test
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {DEMO_ACCOUNTS.map(acc => {
              const isDeveloperAccount = acc.email === 'quantareap@gmail.com';
              return (
                <button
                  key={acc.email}
                  id={`quick-login-${acc.email.split('@')[0]}`}
                  onClick={() => handleQuickLogin(acc.email, acc.password)}
                  disabled={loading}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between group cursor-pointer ${
                    isDeveloperAccount
                      ? 'col-span-1 sm:col-span-2 border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/70 hover:border-emerald-500 shadow-xs'
                      : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-bold ${isDeveloperAccount ? 'text-emerald-950' : 'text-slate-900 group-hover:text-slate-950'}`}>
                      {acc.name}
                      {isDeveloperAccount && (
                        <span className="ml-1.5 text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-normal">
                          Active Account
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                        acc.status === 'SUSPENDED'
                          ? 'bg-red-100 text-red-700'
                          : acc.role === 'business_owner'
                          ? 'bg-emerald-100 text-emerald-800'
                          : acc.role === 'business_manager'
                          ? 'bg-blue-100 text-blue-800'
                          : acc.role === 'platform_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {acc.role.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">{acc.businessName} &bull; {acc.description}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono flex items-center justify-between">
                    <span className="truncate">{acc.email}</span>
                    <span className="text-slate-400 shrink-0 ml-1">PW: {acc.password}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
