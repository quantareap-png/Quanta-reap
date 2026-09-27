/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, Lock, Mail, ArrowRight } from 'lucide-react';

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

  const activeError = localError || error;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#eef4f2_38%,_#f6f7f5_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(34,197,94,0.16),_transparent_30%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-900">
                  Q
                </div>
                <span className="text-sm font-semibold tracking-[0.18em] text-white/80 uppercase">
                  Quanta Reap
                </span>
              </div>

              <div className="mt-10 space-y-6">
                <div className="space-y-4">
                  <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-300/90">
                    Customer retention engine
                  </p>
                  <h1 className="max-w-xs text-4xl font-semibold tracking-tight text-white">
                    Grow repeat visits with less manual work.
                  </h1>
                </div>

                <p className="max-w-sm text-base text-slate-300">
                  Turn everyday transactions into measurable loyalty, smarter retention, and more predictable revenue.
                </p>
              </div>
            </div>

            <div className="relative z-10 grid gap-3 text-sm text-slate-200">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  ✓
                </div>
                <span>Track customer value in real time</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                  ✓
                </div>
                <span>Launch rewards and campaigns faster</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white shadow-sm">
                    Q
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      Quanta Reap
                    </div>
                    <div className="text-xs text-slate-500">Business access</div>
                  </div>
                </div>
              </div>

              <div className="mb-7">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Welcome back
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Sign in to manage loyalty, customers, and revenue in one place.
                </p>
              </div>

              {activeError && (
                <div
                  id="login-error-alert"
                  className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <div className="font-semibold text-red-900">Authentication failed</div>
                    <div className="mt-0.5 text-red-700">{activeError}</div>
                  </div>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="login-email" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Work email
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
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
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/5"
                      placeholder="name@business.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
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
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3 pl-11 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-900/5"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-200 pt-5 text-center text-sm text-slate-600">
                <span>New to Quanta Reap? </span>
                <button
                  id="goto-register-btn"
                  type="button"
                  onClick={onNavigateRegister}
                  className="inline-flex items-center gap-1 font-semibold text-slate-900 transition-colors hover:text-emerald-700"
                >
                  Create business account
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
