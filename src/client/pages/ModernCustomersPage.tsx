/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../api/quanta-api';
import { Customer } from '../types/customer';
import { X } from 'lucide-react';

interface ModernCustomersPageProps {
  onOpenAddPurchaseWithCustomer?: (customer: Customer) => void;
}

export const ModernCustomersPage: React.FC<ModernCustomersPageProps> = ({
  onOpenAddPurchaseWithCustomer,
}) => {
  const { currentBusiness } = useAuth();
  const { theme } = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New customer modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCustomers = useCallback(async () => {
    if (!currentBusiness) return;
    setLoading(true);
    try {
      const res = await api.getCustomers({
        search: searchTerm || undefined,
        limit: 50,
      });
      const list = res.customers || [];
      setCustomers(list);
      if (!selectedCustomer && list.length > 0) {
        setSelectedCustomer(list[0]);
      } else if (selectedCustomer) {
        const ref = list.find(c => c.id === selectedCustomer.id);
        if (ref) setSelectedCustomer(ref);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  }, [currentBusiness, searchTerm]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.createCustomer({
        name: newName.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim() || undefined,
        status: 'ACTIVE',
      });
      setShowAddModal(false);
      setNewName('');
      setNewPhone('');
      setNewEmail('');
      await loadCustomers();
      if (res.customer) setSelectedCustomer(res.customer);
    } catch (err) {
      console.error('Failed to add customer:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const relationshipTimeline = [
    {
      date: 'Today',
      points: '+42 points',
      type: 'Purchase',
      bill: '₹850',
      positive: true,
    },
    {
      date: 'Yesterday',
      points: '-500 points',
      type: 'Reward redeemed (₹100 OFF)',
      positive: false,
    },
    {
      date: '12 Sep',
      points: '+100 points',
      type: 'Purchase',
      bill: '₹2,000',
      positive: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-12 py-10 space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1
            style={{ color: theme.textPrimary }}
            className="text-2xl sm:text-3xl font-display font-medium tracking-[-0.03em]"
          >
            Customers
          </h1>
          <p style={{ color: theme.textSecondary }} className="text-[14px]">
            Build stronger relationships with every customer.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          style={{
            backgroundColor: theme.accent,
            color: theme.accentText,
          }}
          className="py-2.5 px-4 hover:opacity-90 active:opacity-95 rounded-lg text-[13px] font-medium transition-opacity cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)] shrink-0"
        >
          + Add customer
        </button>
      </div>

      {/* Main CRM Grid: Customer Directory + Relationship Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Customer List (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search customers..."
              style={{
                backgroundColor: theme.bgSurface,
                borderColor: theme.border,
                color: theme.textPrimary,
              }}
              className="w-full px-3 py-2 text-[13px] border rounded-lg placeholder-[#A8A29E] focus:outline-hidden transition-colors"
            />
          </div>

          {loading ? (
            <div style={{ color: theme.textMuted }} className="py-8 text-center text-[13px]">
              Loading customer directory...
            </div>
          ) : customers.length === 0 ? (
            <div style={{ color: theme.textSecondary }} className="py-8 text-center text-[13px] space-y-2">
              <p>No customers found.</p>
              <button
                onClick={() => setShowAddModal(true)}
                style={{ color: theme.textPrimary }}
                className="text-[13px] underline font-medium"
              >
                Add new customer
              </button>
            </div>
          ) : (
            <div
              style={{ borderColor: theme.border }}
              className="divide-y divide-[#F5F4F0] border-t border-b"
            >
              {customers.map(c => {
                const isSelected = selectedCustomer?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCustomer(c)}
                    style={{
                      backgroundColor: isSelected ? theme.bgSubtle : 'transparent',
                    }}
                    className="w-full text-left py-3 px-2 flex items-baseline justify-between transition-colors cursor-pointer hover:bg-black/5"
                  >
                    <div>
                      <span
                        style={{
                          color: theme.textPrimary,
                          fontWeight: isSelected ? 600 : 400,
                        }}
                        className="text-[14px] block leading-tight"
                      >
                        {c.name}
                      </span>
                      <span
                        style={{ color: theme.textSecondary }}
                        className="text-[12px] font-mono mt-0.5 block"
                      >
                        {c.phone}
                      </span>
                    </div>

                    <div className="text-right">
                      <span style={{ color: theme.textSecondary }} className="text-[12px]">
                        1,280 pts
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Relationship Profile (6 cols, no heavy boxes, pure typography & spacious layout) */}
        <div className="lg:col-span-6 sticky top-24 space-y-8">
          {selectedCustomer ? (
            <div className="space-y-8">
              {/* Profile Header */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <h2
                    style={{ color: theme.textPrimary }}
                    className="text-2xl font-display font-medium tracking-tight"
                  >
                    {selectedCustomer.name}
                  </h2>
                  {onOpenAddPurchaseWithCustomer && (
                    <button
                      onClick={() => onOpenAddPurchaseWithCustomer(selectedCustomer)}
                      style={{ color: theme.textPrimary }}
                      className="text-[13px] hover:underline font-medium cursor-pointer"
                    >
                      + Add purchase
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[13px]">
                  <span
                    style={{ color: theme.badgeGreenText }}
                    className="font-medium"
                  >
                    Active customer
                  </span>
                  <span style={{ color: theme.textMuted }}>&bull;</span>
                  <span style={{ color: theme.textSecondary }} className="font-mono">
                    {selectedCustomer.phone}
                  </span>
                </div>
              </div>

              {/* 4 Essential Relationship Pillars with Generous Whitespace */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 pt-2">
                <div className="space-y-1">
                  <div
                    style={{ color: theme.textPrimary }}
                    className="text-3xl font-display font-light"
                  >
                    1,280
                  </div>
                  <div
                    style={{ color: theme.textMuted }}
                    className="text-[12px] uppercase tracking-wider"
                  >
                    Points
                  </div>
                </div>

                <div className="space-y-1">
                  <div
                    style={{ color: theme.textPrimary }}
                    className="text-3xl font-display font-light"
                  >
                    Gold
                  </div>
                  <div
                    style={{ color: theme.textMuted }}
                    className="text-[12px] uppercase tracking-wider"
                  >
                    Member
                  </div>
                </div>

                <div className="space-y-1">
                  <div
                    style={{ color: theme.textPrimary }}
                    className="text-3xl font-display font-light"
                  >
                    ₹18,500
                  </div>
                  <div
                    style={{ color: theme.textMuted }}
                    className="text-[12px] uppercase tracking-wider"
                  >
                    Lifetime spend
                  </div>
                </div>

                <div className="space-y-1">
                  <div
                    style={{ color: theme.textPrimary }}
                    className="text-3xl font-display font-light"
                  >
                    18
                  </div>
                  <div
                    style={{ color: theme.textMuted }}
                    className="text-[12px] uppercase tracking-wider"
                  >
                    Visits
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: theme.border }} className="h-px w-full" />

              {/* Relationship Timeline */}
              <div className="space-y-4">
                <div
                  style={{ color: theme.textMuted }}
                  className="text-[11px] font-medium uppercase tracking-[0.08em]"
                >
                  Customer activity
                </div>

                <div className="space-y-3">
                  {relationshipTimeline.map((item, idx) => (
                    <div
                      key={idx}
                      style={{ borderColor: theme.borderSubtle }}
                      className="flex items-baseline justify-between py-1.5 border-b last:border-b-0"
                    >
                      <div className="space-y-0.5">
                        <span
                          style={{ color: theme.textPrimary }}
                          className="text-[13px] font-medium block"
                        >
                          {item.type} {item.bill ? `(${item.bill})` : ''}
                        </span>
                        <span style={{ color: theme.textMuted }} className="text-[12px] block">
                          {item.date}
                        </span>
                      </div>

                      <span
                        style={{
                          color: item.positive ? theme.badgeGreenText : theme.textSecondary,
                        }}
                        className="text-[13px] font-medium"
                      >
                        {item.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: theme.textMuted }} className="py-12 text-center text-[13px]">
              Select a customer to view their relationship profile.
            </div>
          )}
        </div>
      </div>

      {/* Clean Add Customer Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
          <div
            style={{
              backgroundColor: theme.bgSurface,
              borderColor: theme.border,
            }}
            className="rounded-xl border shadow-[0_12px_36px_rgba(0,0,0,0.08)] max-w-sm w-full p-6 space-y-5"
          >
            <div className="flex items-center justify-between pb-1">
              <span
                style={{ color: theme.textPrimary }}
                className="text-[15px] font-medium"
              >
                Add customer
              </span>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ color: theme.textMuted }}
                className="hover:opacity-80"
              >
                <X className="w-4 h-4 stroke-[1.5]" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div className="space-y-1">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ravi Kumar"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="ravi@example.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  style={{
                    backgroundColor: theme.bgSurface,
                    borderColor: theme.border,
                    color: theme.textPrimary,
                  }}
                  className="w-full px-3 py-2 text-[13px] border rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: theme.accent,
                    color: theme.accentText,
                  }}
                  className="w-full py-2.5 px-4 hover:opacity-90 active:opacity-95 rounded-lg text-[13px] font-medium transition-opacity cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  {submitting ? 'Adding...' : 'Add customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
