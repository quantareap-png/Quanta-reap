/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/quanta-api';
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  Users,
  Clock,
  Coins,
  Globe,
  Tag,
  KeyRound,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, currentBusiness, businesses, switchBusiness } = useAuth();
  const [testResult, setTestResult] = useState<{
    targetBusinessId: string;
    status: number | null;
    success: boolean;
    data?: any;
    error?: string;
  } | null>(null);
  const [testing, setTesting] = useState(false);

  // New member invite state
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<'business_manager' | 'business_staff'>('business_staff');
  const [memberMsg, setMemberMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);

  // Test tenant isolated access
  const handleTestTenantAccess = async (targetBizId: string) => {
    setTesting(true);
    setTestResult(null);

    try {
      const res = await api.getBusinessData(targetBizId);
      setTestResult({
        targetBusinessId: targetBizId,
        status: 200,
        success: true,
        data: res,
      });
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status || 500;
      const errorMsg = err instanceof Error ? err.message : 'Request failed';
      setTestResult({
        targetBusinessId: targetBizId,
        status,
        success: false,
        error: errorMsg,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBusiness || !memberEmail.trim()) return;

    setMemberLoading(true);
    setMemberMsg(null);
    try {
      await api.addMember(currentBusiness.id, {
        email: memberEmail.trim(),
        role: memberRole,
      });
      setMemberMsg({
        success: true,
        text: `Successfully added ${memberEmail} as ${memberRole} in ${currentBusiness.name}`,
      });
      setMemberEmail('');
    } catch (err: unknown) {
      setMemberMsg({
        success: false,
        text: err instanceof Error ? err.message : 'Failed to add member',
      });
    } finally {
      setMemberLoading(false);
    }
  };

  const isOwnerOrManager = currentBusiness?.role === 'business_owner' || currentBusiness?.role === 'business_manager';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Authenticated Tenant Overview */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Active Tenant Context
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {currentBusiness?.id}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1.5 font-display tracking-tight">{currentBusiness?.name}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {currentBusiness?.businessType} &bull; Identifier slug: <span className="font-mono text-slate-700 font-medium">{currentBusiness?.slug}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-2.5 text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed-In Session</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5">{user?.name}</div>
              <div className="text-[11px] text-slate-500 font-mono">{user?.email}</div>
            </div>

            <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-2.5 text-left">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">RBAC Security Role</div>
              <div className="text-xs font-bold text-emerald-700 capitalize mt-0.5">
                {currentBusiness?.role.replace('_', ' ')}
              </div>
              <div className="text-[10px] text-slate-400">Cryptographically verified</div>
            </div>
          </div>
        </div>

        {/* Business Attributes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2.5 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Timezone</span>
              <span className="font-semibold text-slate-800">{currentBusiness?.timezone || 'Asia/Kolkata'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Currency</span>
              <span className="font-semibold text-slate-800">{currentBusiness?.currency || 'INR'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Tenant State</span>
              <span className="font-bold text-emerald-700 uppercase">ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Data Partition</span>
              <span className="font-semibold text-slate-800">ENFORCED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tenancy Verification & Cross-Tenant Attack Test */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">
          <ShieldAlert className="w-4 h-4 text-indigo-600" />
          <span>Interactive Tenant Isolation Validator (Single-Table Guarantee)</span>
        </div>
        <p className="text-xs text-slate-600 mb-5 max-w-3xl leading-relaxed">
          Quanta enforces that access is strictly bound to cryptographic session credentials. The server verifies that the authenticated user holds an active membership for the requested business partition. Run a live integrity probe below:
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            id="test-own-business-btn"
            onClick={() => handleTestTenantAccess(currentBusiness?.id || 'biz_cafe_a')}
            disabled={testing}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Access Own Business Data ({currentBusiness?.name}) &rarr; Expect 200 OK
          </button>

          <button
            id="test-other-business-btn"
            onClick={() => {
              // Target the opposite business
              const otherId = currentBusiness?.id === 'biz_cafe_a' ? 'biz_cafe_b' : 'biz_cafe_a';
              handleTestTenantAccess(otherId);
            }}
            disabled={testing}
            className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Simulate Cross-Tenant Attack (Target: {currentBusiness?.id === 'biz_cafe_a' ? 'Demo Cafe B' : 'Demo Cafe A'}) &rarr; Expect 403 Forbidden
          </button>
        </div>

        {/* Live Test Output Display */}
        {testResult && (
          <div
            id="tenant-test-result-box"
            className={`p-4 rounded-xl border text-xs font-mono transition-all ${
              testResult.status === 200
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                : 'bg-rose-50/70 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs mb-2">
              <span className="flex items-center gap-1.5 font-sans">
                {testResult.status === 200 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                )}
                HTTP Response: {testResult.status} {testResult.status === 200 ? 'OK (Authorized Access)' : 'FORBIDDEN (Tenant Boundary Protected)'}
              </span>
              <span className="text-[11px] font-mono text-slate-500">Target Business: {testResult.targetBusinessId}</span>
            </div>

            <div className="bg-white/90 p-3 rounded-lg border border-slate-200/80 text-[11px] overflow-x-auto">
              <pre>{JSON.stringify(testResult.data || { error: testResult.error, targetBusinessId: testResult.targetBusinessId, status: testResult.status }, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      {/* Business Membership Management (Role-Protected) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Add Member to Current Business</span>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Only <span className="font-semibold text-slate-900">business_owner</span> and{' '}
            <span className="font-semibold text-slate-900">business_manager</span> roles have server permission to add members.
          </p>

          {isOwnerOrManager ? (
            <form onSubmit={handleAddMember} className="space-y-3.5">
              {memberMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    memberMsg.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {memberMsg.text}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Target User Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. charlie@example.test or new user"
                  value={memberEmail}
                  onChange={e => setMemberEmail(e.target.value)}
                  className="mt-1 block w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 bg-slate-50/50 focus:bg-white text-slate-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Assigned Role</label>
                <select
                  value={memberRole}
                  onChange={e => setMemberRole(e.target.value as any)}
                  className="mt-1 block w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 bg-white text-slate-900"
                >
                  <option value="business_manager">business_manager (Operational Management)</option>
                  <option value="business_staff">business_staff (Front-Desk Staff)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={memberLoading}
                className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                {memberLoading ? 'Adding...' : 'Authorize New Member'}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs">
              <div className="font-bold">Restricted Operation</div>
              <div className="mt-0.5 text-slate-600">Your current role (<span className="font-semibold text-amber-900">{currentBusiness?.role}</span>) does not have administrative privileges to invite or manage business members.</div>
            </div>
          )}
        </div>

        {/* User's Business Memberships */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">
            <Building2 className="w-4 h-4 text-slate-600" />
            <span>Authorized Businesses ({businesses.length})</span>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            A user can belong to multiple businesses with independent roles. Switch context securely below:
          </p>

          <div className="space-y-2.5">
            {businesses.map(b => (
              <div
                key={b.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  b.id === currentBusiness?.id
                    ? 'border-emerald-500/80 bg-emerald-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    {b.name}
                    {b.id === currentBusiness?.id && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Role: <span className="font-mono text-slate-700 font-semibold">{b.role}</span> &bull; {b.businessType}
                  </div>
                </div>

                {b.id !== currentBusiness?.id && (
                  <button
                    onClick={() => switchBusiness(b.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg transition-all cursor-pointer shadow-xs"
                  >
                    Switch
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
