/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, UserPlus, Lock, Mail, Building, Briefcase, ArrowLeft } from 'lucide-react';

interface RegisterPageProps {
  onNavigateLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateLogin }) => {
  const { register, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Restaurant & Cafe');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!name.trim()) return setLocalError('Full name is required');
    if (!email.trim()) return setLocalError('Valid email is required');
    if (!password || password.length < 8) return setLocalError('Password must be at least 8 characters');
    if (!businessName.trim()) return setLocalError('Business name is required');
    if (!businessType.trim()) return setLocalError('Business type is required');

    try {
      setLoading(true);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        businessName: businessName.trim(),
        businessType: businessType.trim(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setLocalError(msg);
    } finally {
      setLoading(false);
    }
  };

  const activeError = localError || error;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center text-white font-extrabold text-xl font-display shadow-md shadow-slate-900/10">
            Q
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold tracking-tight text-slate-900 font-display">
          Create Quanta Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Provision your business tenant and owner security credentials
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl sm:px-10">
          {activeError && (
            <div
              id="register-error-alert"
              className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5"
            >
              <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Registration Problem</div>
                <div className="text-rose-600 text-[11px] mt-0.5">{activeError}</div>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="reg-name" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Full Name
              </label>
              <div className="mt-1 relative rounded-xl shadow-2xs">
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="block w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 bg-slate-50/50 transition-all"
                  placeholder="e.g. Alice Walker"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="mt-1 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 bg-slate-50/50 transition-all"
                  placeholder="alice@cafe.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Password (min 8 chars)
              </label>
              <div className="mt-1 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="reg-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 bg-slate-50/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label htmlFor="reg-biz-name" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Business Name
              </label>
              <div className="mt-1 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Building className="h-4 w-4" />
                </div>
                <input
                  id="reg-biz-name"
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 bg-slate-50/50 transition-all"
                  placeholder="e.g. Roasters Cafe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-biz-type" className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Business Category
              </label>
              <div className="mt-1 relative rounded-xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <select
                  id="reg-biz-type"
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 text-slate-900 bg-white"
                >
                  <option value="Restaurant & Cafe">Restaurant & Cafe</option>
                  <option value="Specialty Coffee Shop">Specialty Coffee Shop</option>
                  <option value="Retail Boutique">Retail Boutique</option>
                  <option value="Salon & Spa">Salon & Spa</option>
                  <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                  <option value="Fitness & Wellness Club">Fitness & Wellness Club</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-60 transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating business account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Create business account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                id="goto-login-btn"
                onClick={onNavigateLogin}
                className="font-semibold text-slate-900 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
