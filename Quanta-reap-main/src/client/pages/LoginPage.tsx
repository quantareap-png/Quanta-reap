/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  LogIn,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  Repeat2,
  Gift,
} from 'lucide-react';

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
    <div className="min-h-screen bg-[#f6f8f6] text-slate-900 overflow-x-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -left-40 h-[520px] w-[520px] rounded-full bg-emerald-200/20 blur-3xl" />
        <div className="absolute -bottom-52 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-72 w-72 rounded-full bg-white/80 blur-3xl" />
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-3 py-6 sm:px-5 sm:py-8">
        <div className="w-full max-w-[1180px]">

          {/* =========================================================
              MAIN AUTH CARD
          ========================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-[1.08fr_0.92fr] overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_30px_100px_-35px_rgba(15,23,42,0.28)]">

            {/* =====================================================
                LEFT — QUANTAREAP DETAILS
            ====================================================== */}

            <section className="relative flex min-h-[620px] sm:min-h-[680px] flex-col justify-between overflow-hidden bg-[#eef4f0] p-7 sm:p-9 md:p-11 lg:p-14">

              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-emerald-900/10" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border border-emerald-900/10" />
              <div className="pointer-events-none absolute -bottom-40 -left-32 h-80 w-80 rounded-full border border-indigo-900/10" />

              {/* Decorative Q */}
              <div className="pointer-events-none absolute right-8 top-16 select-none text-[180px] font-black leading-none text-slate-900/[0.025]">
                Q
              </div>

              <div className="relative z-10">

                {/* Brand */}
                <div className="flex items-center gap-3">
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/10">
                    <span className="text-lg font-black">Q</span>

                    <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-[#eef4f0]" />
                  </div>

                  <div>
                    <div className="text-[13px] font-black tracking-[0.22em] text-slate-950">
                      QUANTAREAP
                    </div>

                    <div className="mt-0.5 text-[9px] font-semibold tracking-[0.16em] text-slate-500">
                      CUSTOMER RETENTION PLATFORM
                    </div>
                  </div>
                </div>

                {/* Hero */}
                <div className="mt-14 sm:mt-16 md:mt-20 max-w-[650px]">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-800 shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    Customer retention, made simpler.
                  </div>

                  <h1 className="mt-6 text-[2.7rem] leading-[0.98] font-semibold tracking-[-0.055em] text-slate-950 sm:text-5xl md:text-[3.5rem] lg:text-[4rem]">
                    Turn every
                    <span className="block text-emerald-700">
                      customer
                    </span>
                    into a relationship.
                  </h1>

                  <p className="mt-6 max-w-[560px] text-[13px] leading-6 text-slate-600 sm:text-sm sm:leading-7">
                    Quanta gives local businesses one elegant system to build
                    loyalty, understand customer activity, and bring valuable
                    customers back more often.
                  </p>
                </div>

                {/* Feature cards */}
                <div className="mt-9 grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">

                  {/* Loyalty */}
                  <div className="rounded-2xl border border-white/80 bg-white/65 p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <HeartHandshake className="h-4 w-4" />
                    </div>

                    <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-900">
                      Loyalty
                    </div>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      Build structured loyalty programs, points and rewards.
                    </p>
                  </div>

                  {/* Engagement */}
                  <div className="rounded-2xl border border-white/80 bg-white/65 p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                      <Repeat2 className="h-4 w-4" />
                    </div>

                    <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-900">
                      Engagement
                    </div>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      Stay connected beyond individual transactions.
                    </p>
                  </div>

                  {/* Retention */}
                  <div className="rounded-2xl border border-white/80 bg-white/65 p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                      <Gift className="h-4 w-4" />
                    </div>

                    <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-900">
                      Retention
                    </div>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500">
                      Understand activity and identify customers needing attention.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom statement */}
              <div className="relative z-10 mt-8 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="h-px w-10 bg-slate-300" />

                  <p className="text-[10px] font-semibold tracking-wide text-slate-500">
                    One platform for loyalty, engagement and retention.
                  </p>
                </div>
              </div>
            </section>

            {/* =====================================================
                RIGHT — SIGN IN
            ====================================================== */}

            <section className="relative flex min-h-[620px] sm:min-h-[680px] items-center justify-center bg-white px-6 py-10 sm:px-8 md:px-10 lg:px-12">

              {/* Soft decoration */}
              <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-64 w-64 rounded-full bg-emerald-50/70 blur-3xl" />
              <div className="pointer-events-none absolute bottom-[-120px] left-[-100px] h-64 w-64 rounded-full bg-indigo-50/50 blur-3xl" />

              <div className="relative z-10 w-full max-w-[390px]">

                {/* Mobile brand */}
                <div className="mb-10 flex items-center gap-3 sm:hidden">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <span className="text-base font-black">Q</span>
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                  </div>

                  <div>
                    <div className="text-[12px] font-black tracking-[0.2em] text-slate-950">
                      QUANTAREAP
                    </div>

                    <div className="text-[9px] tracking-wide text-slate-500">
                      CUSTOMER RETENTION PLATFORM
                    </div>
                  </div>
                </div>

                {/* Sign in heading */}
                <div>
                  <div className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Business Access
                  </div>

                  <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-slate-950">
                    Welcome back.
                  </h2>

                  <p className="mt-3 text-[13px] leading-6 text-slate-500">
                    Sign in to manage your customers, loyalty programs,
                    rewards and retention activity.
                  </p>
                </div>

                {/* Error */}
                {activeError && (
                  <div
                    id="login-error-alert"
                    className="mt-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700"
                  >
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                    <div>
                      <div className="font-semibold text-red-900">
                        Authentication Failed
                      </div>

                      <div className="mt-1 text-[11px] leading-4 text-red-700">
                        {activeError}
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form
                  className="mt-8 space-y-5"
                  onSubmit={handleSubmit}
                >

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="login-email"
                      className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700"
                    >
                      Work Email
                    </label>

                    <div className="group relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-emerald-600">
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
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                        placeholder="name@business.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      htmlFor="login-password"
                      className="block text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700"
                    >
                      Password
                    </label>

                    <div className="group relative mt-2">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-emerald-600">
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
                        className="block w-full rounded-2xl border border-slate-200 bg-slate-50/70 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      id="login-submit-btn"
                      type="submit"
                      disabled={loading}
                      className="group relative flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-900 hover:shadow-xl hover:shadow-slate-900/15 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                      {loading ? (
                        <>
                          <div className="relative h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span className="relative">
                            Signing in securely...
                          </span>
                        </>
                      ) : (
                        <>
                          <LogIn className="relative h-4 w-4" />

                          <span className="relative">
                            Sign in to Business
                          </span>

                          <ArrowRight className="relative ml-0.5 h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Registration */}
                <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                  <p className="text-xs text-slate-500">
                    New to Quanta?{' '}

                    <button
                      id="goto-register-btn"
                      onClick={onNavigateRegister}
                      className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-slate-900 transition-colors hover:text-emerald-700"
                    >
                      Create business account
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </p>
                </div>

                {/* Security note */}
                <div className="mt-7 flex items-center justify-center gap-2 text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400">
                  <Lock className="h-3 w-3" />
                  Secure business authentication
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-center gap-2 text-[9px] text-slate-400">
            <span>© {new Date().getFullYear()} Quantareap</span>

            <span className="h-1 w-1 rounded-full bg-slate-300" />

            <span>Quanta Customer Retention Platform</span>
          </div>
        </div>
      </div>
    </div>
  );
};