/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../api/quanta-api';
import {
  Activity,
  Layers,
  Database,
  KeyRound,
  Cloud,
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const DiagnosticsPage: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hRes, aRes] = await Promise.all([api.getHealth(), api.getAuditLogs()]);
      setHealthData(hRes);
      setAuditLogs(aRes.logs || []);
    } catch (err) {
      console.error('Failed to fetch diagnostics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              System Diagnostics
            </span>
            <span className="text-xs text-slate-400 font-mono">Quanta v1.0.0-1B</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1.5 font-display tracking-tight">Infrastructure & Module Health</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-tenant runtime telemetry, DynamoDB layer status, and tamper-evident audit log stream.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Infrastructure State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Authentication Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 font-display">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              Authentication
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              LIVE IN PREVIEW
            </span>
          </div>
          <div className="mt-4 space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Active Provider</span>
              <span className="font-mono font-semibold text-slate-800">PreviewAuthProvider</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Credential Security</span>
              <span className="text-slate-600">PBKDF2-SHA512 (10,000 iterations, 32-byte salt, constant-time verification)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Session Token</span>
              <span className="font-mono text-slate-700">qt_[hex(32)], 7-day TTL</span>
            </div>
          </div>
        </div>

        {/* Database Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 font-display">
              <Database className="w-4 h-4 text-indigo-600" />
              DynamoDB Layer
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Emulator active
            </span>
          </div>
          <div className="mt-4 space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Abstraction Layer</span>
              <span className="font-mono font-semibold text-slate-800">DynamoDBDataAccessLayer</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Schema Architecture</span>
              <span className="text-slate-600">Single-Table Design (PK, SK, GSI1PK, GSI1SK)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Unique Conditional Writes</span>
              <span className="text-emerald-700 font-semibold">attribute_not_exists(PK) enforced</span>
            </div>
          </div>
        </div>

        {/* AWS Cognito Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 font-display">
              <Cloud className="w-4 h-4 text-purple-600" />
              AWS Cognito
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Deployment-ready
            </span>
          </div>
          <div className="mt-4 space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Interface Compatibility</span>
              <span className="font-mono font-semibold text-slate-800">IAuthProvider</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Production Status</span>
              <span className="text-slate-600">Cognito adapter ready for zero-downtime hot-swap</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">AWS Cloud Deployment</span>
              <span className="text-slate-500">Local dev container sandbox</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Roadmap Grid */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 font-display">
          <Layers className="w-4 h-4 text-slate-500" />
          <span>Module Lifecycle Architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {healthData?.modules &&
            Object.entries(healthData.modules).map(([modName, modInfo]: [string, any]) => {
              const isDone = modInfo.status === 'COMPLETE';
              return (
                <div
                  key={modName}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                    isDone ? 'border-emerald-200 bg-emerald-50/40' : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold capitalize text-slate-900">{modName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isDone ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {modInfo.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    Phase: <span className="font-semibold text-slate-700">{modInfo.phase}</span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Live Audit Log Stream */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 font-display">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Audit Events Stream ({auditLogs.length} events logged)</span>
          </div>
          <span className="text-[11px] text-slate-400">Sanitized (Zero-knowledge tokens)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-xs">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">Timestamp</th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">Event Type</th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">User ID</th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">Business ID</th>
                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase tracking-wider text-[10px]">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log: any) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        log.eventType === 'ACCESS_DENIED'
                          ? 'bg-rose-100 text-rose-800'
                          : log.eventType === 'AUTHENTICATION_FAILED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {log.eventType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{log.userId || '-'}</td>
                  <td className="px-4 py-3 text-slate-600">{log.businessId || '-'}</td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-xs font-mono">
                    {JSON.stringify(log.details || {})}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
