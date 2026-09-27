/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, LogIn, Lock, Mail, ArrowRight, CheckCircle2, BadgeCheck, Sparkles, Users, Target, TrendingUp } from 'lucide-react';

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

  const activeError = error || localError;

  const productHighlights = [
    {
      title: 'LOYALTY',
      description: 'Build customer relationships with structured loyalty programs, points and rewards.',
      icon: BadgeCheck,
    },
    {
      title: 'ENGAGEMENT',
      description: 'Keep customers connected beyond individual transactions.',
      icon: Users,
    },
    {
      title: 'RETENTION',
      description: 'Understand customer activity and identify customers who may need attention.',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.05),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.08),_transparent_22%),linear-gradient(180deg,#f6f7f4_0%,#eef4f1_100%)] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/80 shadow-[0_28px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <aside className="relative overflow-hidden border-b border-slate-200/80 bg-[linear-gradient(135deg,#f8faf7_0%,#eef6f3_52%,#f6f3fb_100%)] p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10 xl:p-12">
            <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
            <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-indigo-200/20 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))]" />

            <div className="relative max-w-xl">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dff7ef] text-lg font-bold text-[#0f766e] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-emerald-200/80">
                  Q
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">QUANTAREAP</div>
              </div>

              <div className="space-y-6">
                <h1 className="max-w-md text-4xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-5xl lg:text-[3.35rem] lg:leading-[1.04]">
                  Customer retention,
                  <span className="block text-slate-700">made simpler.</span>
                </h1>

                <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  Quanta helps local businesses build customer loyalty, manage rewards, understand customer activity,
                  encourage repeat visits, and identify customers who may need attention.
                </p>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {productHighlights.map(({ title, description, icon: Icon }) => (
                  <div
                    key={title}
                    className="group rounded-[22px] border border-slate-200/80 bg-white/80 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(15,23,42,0.05)]"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</div>
                    <p className="text-sm leading-6 text-slate-700">{description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4 rounded-[26px] border border-emerald-200/80 bg-[linear-gradient(135deg,rgba(224,242,241,0.9),rgba(255,255,255,0.82))] p-4 shadow-[0_18px_35px_rgba(16,185,129,0.08)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-base font-medium leading-6 text-slate-700">
                  One platform for customer loyalty, engagement, and retention.
                </p>
              </div>
            </div>
          </aside>

          <main className="flex items-center justify-center bg-white px-5 py-8 sm:px-8 md:px-10 lg:px-10 xl:px-12">
            <div className="w-full max-w-md">
              <div className="mb-8 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-[0_10px_20px_rgba(15,23,42,0.2)]">
                    Q
                  </div>
                  <div>
                    <div className="text-lg font-semibold tracking-[-0.03em] text-slate-900">Quanta</div>
                  </div>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                  Business Access
                </div>
              </div>

              <div className="mb-7">
                <h2 className="text-3xl font-semibold tracking-[-0.06em] text-slate-900">Welcome back</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Sign in to manage your customer loyalty and retention program.
                </p>
              </div>

              {activeError && (
                <div
                  id="login-error-alert"
                  className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 shadow-sm"
                  role="alert"
                >
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                  <div>
                    <div className="font-semibold text-red-900">Authentication failed</div>
                    <div className="mt-0.5 text-sm text-red-700">{activeError}</div>
                  </div>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-slate-700">
                    Work Email
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
                      placeholder="name@business.com"
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-slate-700">
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
                      placeholder="••••••••"
                      className="block w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-200"
                    />
                  </div>
                </div>

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-4 w-4" />
                      <span>Sign in to Business</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 border-t border-slate-200 pt-6 text-center">
                <p className="text-sm text-slate-600">
                  <span className="mr-1.5">New to Quanta?</span>
                  <button
                    id="goto-register-btn"
                    type="button"
                    onClick={onNavigateRegister}
                    className="inline-flex items-center gap-1.5 font-semibold text-slate-900 transition hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <span>Create business account</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
