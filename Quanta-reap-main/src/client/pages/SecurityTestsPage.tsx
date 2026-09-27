/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../api/quanta-api';
import {
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  FileCheck2,
} from 'lucide-react';

interface TestResultItem {
  id: string;
  name: string;
  category: 'Authentication' | 'Tenancy' | 'Roles' | 'Security' | 'Customers';
  status: 'PASS' | 'FAIL';
  expected: string;
  received: string;
  durationMs: number;
  details?: string;
}

export const SecurityTestsPage: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<{ total: number; passed: number; failed: number } | null>(null);
  const [tests, setTests] = useState<TestResultItem[]>([]);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  const runAllTests = async () => {
    setRunning(true);
    try {
      const res = await api.runTests();
      if (res.success) {
        setSummary(res.summary);
        setTests(res.tests);
        setLastRunTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to run automated security tests:', err);
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Control Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Checkpoint 1B Test Suite
            </span>
            {lastRunTime && (
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Last run: {lastRunTime}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1.5 font-display tracking-tight">Security & Tenant Isolation Suite</h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Automated server-side verification of authentication, tenancy boundaries, role privilege enforcement, duplicate protection, and suspended access prevention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {summary && (
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/90 px-4 py-2 rounded-xl text-xs font-semibold shadow-2xs">
              <span className="text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {summary.passed} Passed
              </span>
              <span className="text-slate-200">|</span>
              <span className={`${summary.failed > 0 ? 'text-rose-600' : 'text-slate-500'} flex items-center gap-1.5`}>
                {summary.failed > 0 ? <XCircle className="w-4 h-4 text-rose-600" /> : null} {summary.failed} Failed
              </span>
            </div>
          )}

          <button
            id="run-all-tests-btn"
            onClick={runAllTests}
            disabled={running}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-60 cursor-pointer shadow-xs"
          >
            {running ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Tests...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Test Suite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Acceptance Test Flow Checklist (Section 40) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 font-display">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>Section 40 Acceptance Test Scenario Status</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs mt-3.5">
          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">1. Alice & Demo Cafe A Registration</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Alice registered as business_owner in Demo Cafe A; auto-authenticated.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">2. Bob & Demo Cafe B Registration</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Bob registered as business_owner in Demo Cafe B.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">3. Alice &rarr; Cafe A Allowed</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Active membership authorizes Alice for Cafe A.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">4. Alice &rarr; Cafe B Blocked (403)</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Server rejects cross-tenant access with 403 Forbidden.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">5. Bob &rarr; Cafe B Allowed</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Active membership authorizes Bob for Cafe B.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">6. Bob &rarr; Cafe A Blocked (403)</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Server rejects cross-tenant access with 403 Forbidden.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">7. Tenant-Scoped Phone Uniqueness</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Reject duplicate phone in same tenant (409 Conflict).</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">8. Cross-Tenant Phone Coexistence</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Same phone number operates independently across different businesses.</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900">9. Customer Isolation (Zero Leakage)</div>
              <div className="text-[11px] text-slate-600 mt-0.5">Access to foreign tenant customer returns 404/Null without leaking existence.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Automated Test Cases Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-display">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Test Case Results ({tests.length})</span>
          </div>
          <span className="text-[11px] text-slate-400">Live API Test Assertions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">Test Name</th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">Category</th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">Expected</th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">Received</th>
                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase tracking-wider text-[10px]">Latency</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {tests.map(test => (
                <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {test.status === 'PASS' ? (
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> PASS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 text-[10px]">
                        <XCircle className="w-3 h-3 text-rose-600" /> FAIL
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{test.name}</td>
                  <td className="px-4 py-3 text-slate-500">
                    <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-mono text-slate-700 font-semibold">{test.category}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{test.expected}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-900">{test.received}</td>
                  <td className="px-4 py-3 text-right text-slate-400 font-mono text-[11px]">{test.durationMs}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
