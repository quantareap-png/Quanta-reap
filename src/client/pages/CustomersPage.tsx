/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/quanta-api';
import { Customer } from '../types/customer';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  Tag,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Edit3,
  ChevronRight,
  UserCheck,
  UserX,
  RefreshCw,
  Building2,
  ShieldCheck,
  Filter,
  X,
  AlertCircle,
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { currentBusiness } = useAuth();

  // State
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Quick staff phone lookup
  const [quickPhone, setQuickPhone] = useState('');
  const [quickResults, setQuickResults] = useState<Customer[] | null>(null);
  const [quickLoading, setQuickLoading] = useState(false);

  // Modal forms
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    tags: '',
    notes: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load customers for active business tenant
  const fetchCustomers = useCallback(async () => {
    if (!currentBusiness) return;
    setLoading(true);
    try {
      const res = await api.getCustomers({
        search: searchTerm || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      setCustomers(res.customers || []);
      // If a customer was selected, refresh their details
      if (selectedCustomer) {
        const refreshed = (res.customers || []).find(c => c.id === selectedCustomer.id);
        if (refreshed) setSelectedCustomer(refreshed);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  }, [currentBusiness, searchTerm, statusFilter, selectedCustomer]);

  useEffect(() => {
    fetchCustomers();
  }, [currentBusiness?.id, statusFilter]);

  // Quick staff phone lookup handler
  const handleQuickLookup = async (phoneQuery: string) => {
    setQuickPhone(phoneQuery);
    const digits = phoneQuery.replace(/\D/g, '');
    if (digits.length < 3) {
      setQuickResults(null);
      return;
    }

    setQuickLoading(true);
    try {
      const res = await api.lookupCustomerByPhone(phoneQuery);
      setQuickResults(res.customers || []);
    } catch (err) {
      console.error('Lookup error:', err);
      setQuickResults([]);
    } finally {
      setQuickLoading(false);
    }
  };

  // Create Customer Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await api.createCustomer({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
        status: formData.status,
        tags: tagsArray,
        notes: formData.notes.trim() || undefined,
      });

      setShowCreateModal(false);
      resetForm();
      await fetchCustomers();
      setSelectedCustomer(res.customer);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to register customer';
      setFormError(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Edit Customer Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    setFormError(null);
    setFormSubmitting(true);

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const res = await api.updateCustomer(selectedCustomer.id, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        dateOfBirth: formData.dateOfBirth.trim() || undefined,
        status: formData.status,
        tags: tagsArray,
        notes: formData.notes.trim() || undefined,
      });

      setShowEditModal(false);
      setSelectedCustomer(res.customer);
      await fetchCustomers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update customer';
      setFormError(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Status Toggles
  const handleToggleStatus = async (customer: Customer) => {
    try {
      if (customer.status === 'ACTIVE') {
        const res = await api.deactivateCustomer(customer.id);
        setSelectedCustomer(res.customer);
      } else {
        const res = await api.activateCustomer(customer.id);
        setSelectedCustomer(res.customer);
      }
      await fetchCustomers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Status update failed';
      alert(msg);
    }
  };

  const openEditModal = (customer: Customer) => {
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email || '',
      dateOfBirth: customer.dateOfBirth || '',
      status: customer.status,
      tags: (customer.tags || []).join(', '),
      notes: customer.notes || '',
    });
    setFormError(null);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      status: 'ACTIVE',
      tags: '',
      notes: '',
    });
    setFormError(null);
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return '—';
    try {
      return new Date(isoStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 font-display">Customer Directory</h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Isolation
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Active tenant database for <span className="font-semibold text-slate-800">{currentBusiness?.name}</span> &bull; <span className="font-mono text-slate-400">ID: {currentBusiness?.id}</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              id="refresh-customers-btn"
              onClick={() => fetchCustomers()}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Refresh Customers"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              id="add-customer-btn"
              onClick={() => {
                resetForm();
                setShowCreateModal(true);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Register Customer
            </button>
          </div>
        </div>

        {/* Staff Quick-Lookup Panel */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              Counter Staff Phone Quick-Lookup
            </label>
            <div className="relative">
              <input
                id="quick-phone-input"
                type="text"
                value={quickPhone}
                onChange={e => handleQuickLookup(e.target.value)}
                placeholder="Type digits (e.g. 9811, 43210) for instant front-desk lookup..."
                className="w-full text-xs px-3 py-2.5 pl-9 bg-slate-50/60 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder-slate-400 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
              {quickPhone && (
                <button
                  onClick={() => {
                    setQuickPhone('');
                    setQuickResults(null);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick lookup results dropdown/cards */}
            {quickResults !== null && (
              <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-2 divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {quickLoading ? (
                  <div className="text-xs text-slate-500 p-2 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" /> Looking up customer records...
                  </div>
                ) : quickResults.length === 0 ? (
                  <div className="text-xs text-slate-500 p-2">
                    No registered customer matches &quot;{quickPhone}&quot; in {currentBusiness?.name}.
                  </div>
                ) : (
                  quickResults.map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setQuickResults(null);
                        setQuickPhone('');
                      }}
                      className="p-2.5 hover:bg-slate-50 rounded-lg cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{c.phone}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        c.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 text-xs flex flex-col justify-center">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero-Leakage Tenancy</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Customer data and phone records are deterministically partitioned by business ID. Confidentiality is cryptographically enforced.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Customer Directory + Customer Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Directory List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <input
                id="search-customers-input"
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') fetchCustomers();
                }}
                placeholder="Search customers by name, phone, email, or tag..."
                className="w-full text-xs px-3.5 py-2.5 pl-9 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 placeholder-slate-400 transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex rounded-xl border border-slate-200 p-0.5 bg-slate-100/60 text-xs">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    statusFilter === 'ALL' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  All ({customers.length})
                </button>
                <button
                  onClick={() => setStatusFilter('ACTIVE')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    statusFilter === 'ACTIVE' ? 'bg-white shadow-xs text-emerald-800 font-semibold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('INACTIVE')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    statusFilter === 'INACTIVE' ? 'bg-white shadow-xs text-slate-800 font-semibold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Inactive
                </button>
              </div>

              <button
                onClick={() => fetchCustomers()}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
              >
                Search
              </button>
            </div>
          </div>

          {/* Customer Table / List */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
                <span>Loading customer directory...</span>
              </div>
            ) : customers.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-slate-900 font-display">No Customers Found</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchTerm
                    ? `No customers match search "${searchTerm}" in this business.`
                    : 'Get started by creating your first customer profile for this business.'}
                </p>
                <button
                  onClick={() => {
                    resetForm();
                    setShowCreateModal(true);
                  }}
                  className="px-4 py-2 text-xs bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Register Customer
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {customers.map(c => {
                  const isSelected = selectedCustomer?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCustomer(c)}
                      className={`p-4 hover:bg-slate-50/80 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isSelected ? 'bg-indigo-50/40 border-l-4 border-l-indigo-600' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200/80">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900 truncate">{c.name}</span>
                            <span
                              className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                                c.status === 'ACTIVE'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {c.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                            <span className="font-mono text-slate-800 font-semibold">{c.phone}</span>
                            {c.email && <span className="truncate">&bull; {c.email}</span>}
                          </div>
                          {c.tags && c.tags.length > 0 && (
                            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                              {c.tags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                              {c.tags.length > 3 && (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  +{c.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400 hidden sm:inline">
                          {formatDate(c.lastActivityAt || c.createdAt)}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer Inspector / Detail Panel */}
        <div className="space-y-4">
          {selectedCustomer ? (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white font-bold text-base shadow-xs">
                    {selectedCustomer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 font-display">{selectedCustomer.name}</h2>
                    <span
                      className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mt-1 ${
                        selectedCustomer.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {selectedCustomer.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(selectedCustomer)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Customer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Attributes */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono font-bold text-slate-900">{selectedCustomer.phone}</span>
                </div>

                {selectedCustomer.email && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{selectedCustomer.email}</span>
                  </div>
                )}

                {selectedCustomer.dateOfBirth && (
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Born: {selectedCustomer.dateOfBirth}</span>
                  </div>
                )}

                <div className="flex items-center gap-2.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Last Activity: {formatDate(selectedCustomer.lastActivityAt)}</span>
                </div>

                <div className="flex items-center gap-2.5 text-slate-600">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-[11px] text-slate-500">Tenant: {selectedCustomer.businessId}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" /> Tags
                </div>
                {selectedCustomer.tags && selectedCustomer.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCustomer.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 italic">No tags assigned</div>
                )}
              </div>

              {/* Notes */}
              <div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-slate-400" /> Notes
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedCustomer.notes || 'No customer notes recorded.'}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(selectedCustomer)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border cursor-pointer ${
                    selectedCustomer.status === 'ACTIVE'
                      ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {selectedCustomer.status === 'ACTIVE' ? (
                    <>
                      <UserX className="w-3.5 h-3.5" /> Deactivate Customer
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5" /> Activate Customer
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">Customer Inspector</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select any customer from the directory or use phone quick-lookup to review loyalty data and manage preferences.
              </p>
            </div>
          )}

          {/* Architecture Card */}
          <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Deterministic DynamoDB Key Schema</span>
            </div>
            <div className="font-mono text-[10px] space-y-1.5 text-slate-600 bg-white/80 p-3 rounded-xl border border-slate-200/80">
              <div>PK: <span className="text-slate-900 font-semibold">BIZ#{currentBusiness?.id}</span></div>
              <div>SK: <span className="text-slate-900 font-semibold">CUST#{selectedCustomer?.id || '&lt;customerId&gt;'}</span></div>
              <div>GSI1PK: <span className="text-slate-900 font-semibold">BIZ#{currentBusiness?.id}</span></div>
              <div>GSI1SK: <span className="text-slate-900 font-semibold">PHONE#&lt;normalizedPhone&gt;</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Add New Customer</h3>
                  <p className="text-[11px] text-gray-500">Scoped to {currentBusiness?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maya Lin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9876543210 or +91..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. customer@example.test"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. VIP, Coffee Regular, Weekend"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes / Preferences</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Special preferences, allergies, membership notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-1.5"
                >
                  {formSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Create Customer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Edit Customer Profile</h3>
                  <p className="text-[11px] text-gray-500">{selectedCustomer?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notes / Preferences</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-1.5"
                >
                  {formSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
