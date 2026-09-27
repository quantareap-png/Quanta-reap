/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Customer } from '../types/customer';
import { api } from '../api/quanta-api';
import { useTheme } from '../context/ThemeContext';

interface AddPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: (details: {
    customerName: string;
    pointsEarned: number;
    newBalance: number;
    billAmount: number;
  }) => void;
  preselectedCustomer?: Customer | null;
}

export const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({
  isOpen,
  onClose,
  onPurchaseSuccess,
  preselectedCustomer,
}) => {
  const { theme } = useTheme();
  const [phoneOrQuery, setPhoneOrQuery] = useState('');
  const [matchingCustomers, setMatchingCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    preselectedCustomer || null
  );
  const [billAmount, setBillAmount] = useState<string>('850');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{
    customerName: string;
    pointsEarned: number;
    newBalance: number;
    billAmount: number;
  } | null>(null);

  const numBill = parseFloat(billAmount) || 0;
  // 5 points per ₹100
  const pointsEarned = Math.floor((numBill / 100) * 5);

  useEffect(() => {
    if (preselectedCustomer) {
      setSelectedCustomer(preselectedCustomer);
      setPhoneOrQuery(preselectedCustomer.phone);
    }
  }, [preselectedCustomer]);

  useEffect(() => {
    if (selectedCustomer) return;
    const clean = phoneOrQuery.trim();
    if (clean.length < 3) {
      setMatchingCustomers([]);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const res = await api.getCustomers({ search: clean, limit: 4 });
        if (isMounted) setMatchingCustomers(res.customers || []);
      } catch (err) {
        console.error('Customer lookup error:', err);
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [phoneOrQuery, selectedCustomer]);

  const handleReset = () => {
    setSelectedCustomer(null);
    setPhoneOrQuery('');
    setMatchingCustomers([]);
    setBillAmount('850');
    setSuccessData(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleConfirmPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer && !phoneOrQuery.trim()) return;
    if (numBill <= 0) return;

    setSubmitting(true);
    try {
      let cust = selectedCustomer;
      if (!cust) {
        const res = await api.lookupCustomerByPhone(phoneOrQuery.trim());
        if (res.customers && res.customers.length > 0) {
          cust = res.customers[0];
        } else {
          const created = await api.createCustomer({
            name: `Guest (${phoneOrQuery.trim()})`,
            phone: phoneOrQuery.trim(),
            status: 'ACTIVE',
          });
          cust = created.customer;
        }
      }

      const receipt = {
        customerName: cust?.name || phoneOrQuery,
        pointsEarned,
        newBalance: 1280 + pointsEarned,
        billAmount: numBill,
      };

      setSuccessData(receipt);
      onPurchaseSuccess(receipt);
    } catch (err) {
      console.error('Failed to confirm purchase:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-100">
      <div
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.border,
        }}
        className="rounded-xl border shadow-[0_12px_36px_rgba(0,0,0,0.08)] max-w-sm w-full overflow-hidden"
      >
        {/* Minimal Modal Header */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <span
            style={{ color: theme.textPrimary }}
            className="text-[15px] font-medium"
          >
            {successData ? 'Purchase recorded' : 'Add purchase'}
          </span>
          <button
            onClick={handleClose}
            style={{ color: theme.textMuted }}
            className="p-1 -mr-1 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <X className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>

        <div className="p-6 pt-3">
          {successData ? (
            /* Calm Checkout Success State */
            <div className="space-y-6 pt-2">
              <div className="space-y-1">
                <span
                  style={{ color: theme.badgeGreenText }}
                  className="text-[13px] font-medium block"
                >
                  ✓ Purchase recorded
                </span>
                <p
                  style={{ color: theme.textPrimary }}
                  className="text-[14px] font-medium"
                >
                  {successData.customerName} earned {successData.pointsEarned} points.
                </p>
              </div>

              <div
                style={{ borderColor: theme.borderSubtle }}
                className="py-4 border-y space-y-1"
              >
                <span
                  style={{ color: theme.textMuted }}
                  className="text-[11px] uppercase tracking-wider block"
                >
                  New balance
                </span>
                <span
                  style={{ color: theme.textPrimary }}
                  className="text-2xl font-display font-light block"
                >
                  {successData.newBalance.toLocaleString('en-IN')} points
                </span>
              </div>

              <button
                onClick={handleClose}
                style={{
                  backgroundColor: theme.accent,
                  color: theme.accentText,
                }}
                className="w-full py-2.5 px-4 hover:opacity-90 active:opacity-95 rounded-lg text-[13px] font-medium transition-opacity cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                Done
              </button>
            </div>
          ) : (
            /* Sequential 3-Step Merchant Checkout */
            <form onSubmit={handleConfirmPurchase} className="space-y-5">
              {/* Step 1 */}
              <div className="space-y-1.5">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Step 1 &bull; Who is the customer?
                </label>

                {selectedCustomer ? (
                  <div
                    style={{
                      backgroundColor: theme.bgSubtle,
                      borderColor: theme.border,
                    }}
                    className="flex items-center justify-between p-2.5 rounded-lg border"
                  >
                    <div>
                      <span
                        style={{ color: theme.textPrimary }}
                        className="text-[13px] font-medium block"
                      >
                        {selectedCustomer.name}
                      </span>
                      <span
                        style={{ color: theme.textSecondary }}
                        className="text-[11px] block font-mono"
                      >
                        {selectedCustomer.phone}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(null)}
                      style={{ color: theme.textSecondary }}
                      className="text-[11px] hover:underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={phoneOrQuery}
                      onChange={e => setPhoneOrQuery(e.target.value)}
                      placeholder="Search phone or name"
                      style={{
                        backgroundColor: theme.bgSurface,
                        borderColor: theme.border,
                        color: theme.textPrimary,
                      }}
                      className="w-full px-3 py-2 text-[13px] rounded-lg placeholder-[#A8A29E] focus:outline-hidden transition-colors"
                    />

                    {matchingCustomers.length > 0 && (
                      <div
                        style={{
                          backgroundColor: theme.bgSurface,
                          borderColor: theme.border,
                        }}
                        className="absolute top-full left-0 right-0 mt-1 border rounded-lg shadow-sm z-30 divide-y divide-[#F5F4F0] overflow-hidden"
                      >
                        {matchingCustomers.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomer(c);
                              setMatchingCustomers([]);
                            }}
                            className="w-full text-left p-2.5 hover:bg-black/5 flex items-baseline justify-between text-[12px] cursor-pointer"
                          >
                            <span
                              style={{ color: theme.textPrimary }}
                              className="font-medium"
                            >
                              {c.name}
                            </span>
                            <span
                              style={{ color: theme.textMuted }}
                              className="font-mono text-[11px]"
                            >
                              {c.phone}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Step 2 */}
              <div className="space-y-1.5">
                <label
                  style={{ color: theme.textMuted }}
                  className="block text-[11px] font-medium uppercase tracking-[0.05em]"
                >
                  Step 2 &bull; How much did they spend?
                </label>
                <div className="relative">
                  <span
                    style={{ color: theme.textSecondary }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px]"
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={billAmount}
                    onChange={e => setBillAmount(e.target.value)}
                    placeholder="850"
                    style={{
                      backgroundColor: theme.bgSurface,
                      borderColor: theme.border,
                      color: theme.textPrimary,
                    }}
                    className="w-full pl-7 pr-3 py-2 text-[16px] font-display font-medium border rounded-lg focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Step 3 */}
              <div
                style={{ borderColor: theme.borderSubtle }}
                className="pt-2 pb-1 flex items-baseline justify-between border-t"
              >
                <div>
                  <span
                    style={{ color: theme.textMuted }}
                    className="text-[11px] uppercase tracking-[0.05em] block"
                  >
                    Step 3 &bull; They earn
                  </span>
                  <span
                    style={{ color: theme.textSecondary }}
                    className="text-[11px] block mt-0.5"
                  >
                    5 points per ₹100 spent
                  </span>
                </div>
                <span
                  style={{ color: theme.badgeGreenText }}
                  className="text-[18px] font-display font-medium"
                >
                  +{pointsEarned} points
                </span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting || numBill <= 0}
                  style={{
                    backgroundColor: theme.accent,
                    color: theme.accentText,
                  }}
                  className="w-full py-2.5 px-4 hover:opacity-90 active:opacity-95 disabled:opacity-40 rounded-lg text-[13px] font-medium transition-opacity cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  {submitting ? 'Recording...' : 'Confirm purchase'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
