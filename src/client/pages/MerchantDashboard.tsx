/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Clock,
  Gift,
  UserPlus,
  ArrowUpRight,
  TrendingUp,
  Users,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface MerchantDashboardProps {
  onOpenAddPurchase: () => void;
  onNavigateCustomers: () => void;
  onNavigateRewards: () => void;
  onNavigateLoyalty: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({
  onOpenAddPurchase,
  onNavigateCustomers,
  onNavigateRewards,
  onNavigateLoyalty,
}) => {
  const { currentBusiness } = useAuth();
  const { theme } = useTheme();

  // Retention trend weekly data
  const retentionPoints = [
    { label: 'Week 1', rate: 64, date: 'Aug 24' },
    { label: 'Week 2', rate: 68, date: 'Aug 31' },
    { label: 'Week 3', rate: 69, date: 'Sep 07' },
    { label: 'Week 4', rate: 71, date: 'Sep 14' },
    { label: 'Current', rate: 72, date: 'Sep 21' },
  ];

  // Recent customer activity (Today's Actions)
  const activityItems = [
    {
      id: 'act-1',
      name: 'Ravi Kumar',
      initials: 'RK',
      avatarBg: '#E8F1EC',
      avatarColor: theme.accent,
      action: 'Purchase',
      detail: 'Bill of ₹850 recorded',
      pointsDelta: '+42 points',
      isPositive: true,
      time: '2 min ago',
    },
    {
      id: 'act-2',
      name: 'Anita',
      initials: 'A',
      avatarBg: '#DCFCE7',
      avatarColor: theme.accentGreen,
      action: 'Joined loyalty',
      detail: 'Welcome bonus awarded',
      pointsDelta: '+50 points',
      isPositive: true,
      time: '12 min ago',
    },
    {
      id: 'act-3',
      name: 'Rahul',
      initials: 'R',
      avatarBg: '#FEF3C7',
      avatarColor: theme.accentAmber,
      action: 'Redeemed reward',
      detail: '₹100 off dessert voucher',
      pointsDelta: '-500 points',
      isPositive: false,
      time: '25 min ago',
    },
    {
      id: 'act-4',
      name: 'Pooja',
      initials: 'P',
      avatarBg: '#E8F1EC',
      avatarColor: theme.accent,
      action: 'Purchase',
      detail: 'Bill of ₹1,300 recorded',
      pointsDelta: '+65 points',
      isPositive: true,
      time: '54 min ago',
    },
    {
      id: 'act-5',
      name: 'Rohit Verma',
      initials: 'RV',
      avatarBg: '#F3E8FF',
      avatarColor: '#7E22CE',
      action: 'Tier upgrade',
      detail: 'Unlocked Silver Tier status',
      pointsDelta: 'Silver VIP',
      isPositive: true,
      time: '1 hr ago',
    },
  ];

  // Customer Segments with real human presence (avatars/initials)
  const customerSegments = [
    {
      title: 'Returning',
      percentage: '72%',
      count: '1,820',
      description: 'Visit every 11 days on average',
      color: theme.accent,
      barWidth: '72%',
      customers: [
        { name: 'Ravi Kumar', initials: 'RK' },
        { name: 'Pooja Sharma', initials: 'PS' },
        { name: 'Ananya Roy', initials: 'AR' },
        { name: 'Karan Mehra', initials: 'KM' },
      ],
      badge: '+4.2% this month',
    },
    {
      title: 'New members',
      percentage: '16%',
      count: '412',
      description: 'Enrolled within last 30 days',
      color: theme.accentGreen,
      barWidth: '16%',
      customers: [
        { name: 'Anita', initials: 'A' },
        { name: 'Siddharth P.', initials: 'SP' },
        { name: 'Neha V.', initials: 'NV' },
      ],
      badge: '12 this week',
    },
    {
      title: 'At risk',
      percentage: '12%',
      count: '308',
      description: 'No visit in 30+ days',
      color: theme.accentAmber,
      barWidth: '12%',
      customers: [
        { name: 'Rahul', initials: 'R' },
        { name: 'Devendra K.', initials: 'DK' },
        { name: 'Sunita B.', initials: 'SB' },
      ],
      badge: 'Attention needed',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-7 space-y-7">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER: Warm Greeting & Refined Primary CTA
      ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1
              style={{ color: theme.textPrimary }}
              className="text-2xl sm:text-3xl font-display font-medium tracking-tight"
            >
              Good morning, {currentBusiness?.name || 'Demo Cafe'}
            </h1>
          </div>
          <p
            style={{ color: theme.textSecondary }}
            className="text-[14px] sm:text-[15px] mt-1"
          >
            Your customers are coming back. Here's what deserves your attention today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="dash-add-purchase-btn"
            onClick={onOpenAddPurchase}
            style={{
              backgroundColor: theme.accent,
              color: theme.accentText,
            }}
            className="py-2.5 px-4 sm:px-5 rounded-lg text-[13px] font-medium transition-all hover:opacity-95 active:scale-[0.99] flex items-center gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.1)] cursor-pointer"
          >
            <span className="text-base font-light leading-none">+</span>
            <span>Add Purchase</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. PRIMARY RETENTION WORKSPACE SURFACE (Slightly Elevated)
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.border,
        }}
        className="rounded-xl border p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column (7 cols): Customer Retention & Trend Line */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span
                  style={{ color: theme.textMuted }}
                  className="text-[11px] font-semibold uppercase tracking-[0.08em] block"
                >
                  Customer Retention
                </span>
                <div className="flex items-baseline gap-3.5 mt-1.5">
                  <span
                    style={{ color: theme.textPrimary }}
                    className="text-5xl sm:text-6xl font-display font-normal tracking-tight leading-none"
                  >
                    72%
                  </span>
                  <div className="space-y-0.5">
                    <span
                      style={{
                        backgroundColor: theme.accentGreenBg,
                        color: theme.accentGreen,
                      }}
                      className="inline-flex items-center gap-1 text-[12px] font-medium px-2 py-0.5 rounded-md"
                    >
                      <TrendingUp className="w-3 h-3 stroke-[2]" />
                      +4.2% vs last month
                    </span>
                    <span
                      style={{ color: theme.textSecondary }}
                      className="text-[13px] block"
                    >
                      Customers returning within 30 days
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Refined Retention Visualization: Smooth curve, subtle area, restrained accent */}
            <div className="pt-2">
              <div className="h-28 w-full relative">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 500 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="retentionAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={theme.accent} stopOpacity="0.14" />
                      <stop offset="100%" stopColor={theme.accent} stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  {/* Subtle horizontal baseline guides */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke={theme.borderSubtle} strokeDasharray="3 3" />
                  <line x1="0" y1="55" x2="500" y2="55" stroke={theme.borderSubtle} strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke={theme.border} />

                  {/* Area fill */}
                  <path
                    d="M 0 75 C 120 70, 220 50, 360 35 C 430 28, 470 20, 500 16 L 500 90 L 0 90 Z"
                    fill="url(#retentionAreaGrad)"
                  />

                  {/* Refined smooth line */}
                  <path
                    d="M 0 75 C 120 70, 220 50, 360 35 C 430 28, 470 20, 500 16"
                    fill="none"
                    stroke={theme.accent}
                    strokeWidth="2.25"
                    strokeLinecap="round"
                  />

                  {/* Highlight current peak */}
                  <circle cx="0" cy="75" r="3" fill={theme.accent} />
                  <circle cx="125" cy="65" r="3" fill={theme.accent} />
                  <circle cx="250" cy="48" r="3" fill={theme.accent} />
                  <circle cx="375" cy="32" r="3" fill={theme.accent} />
                  <circle cx="500" cy="16" r="4.5" fill={theme.accent} />
                  <circle cx="500" cy="16" r="7" fill="none" stroke={theme.accent} strokeWidth="1.5" opacity="0.35" />
                </svg>
              </div>

              {/* Weekly interval labels */}
              <div className="flex items-center justify-between text-[11px] pt-2 px-1">
                {retentionPoints.map((pt, idx) => (
                  <div key={idx} className="text-center">
                    <span
                      style={{ color: idx === retentionPoints.length - 1 ? theme.textPrimary : theme.textSecondary }}
                      className={`block ${idx === retentionPoints.length - 1 ? 'font-semibold' : 'font-normal'}`}
                    >
                      {pt.label}
                    </span>
                    <span style={{ color: theme.textMuted }} className="block text-[10px]">
                      {pt.rate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Clean Metric Triplets */}
          <div
            style={{ borderColor: theme.border }}
            className="lg:col-span-5 grid grid-cols-3 gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-8"
          >
            <div className="space-y-1">
              <span
                style={{ color: theme.textMuted }}
                className="text-[11px] font-semibold uppercase tracking-[0.08em] block"
              >
                Customers
              </span>
              <div
                style={{ color: theme.textPrimary }}
                className="text-2xl sm:text-3xl font-display font-medium"
              >
                2,540
              </div>
              <span style={{ color: theme.textSecondary }} className="text-[12px] block">
                Enrolled members
              </span>
            </div>

            <div className="space-y-1">
              <span
                style={{ color: theme.textMuted }}
                className="text-[11px] font-semibold uppercase tracking-[0.08em] block"
              >
                Active
              </span>
              <div
                style={{ color: theme.textPrimary }}
                className="text-2xl sm:text-3xl font-display font-medium"
              >
                1,820
              </div>
              <span style={{ color: theme.textSecondary }} className="text-[12px] block">
                This month
              </span>
            </div>

            <div className="space-y-1">
              <span
                style={{ color: theme.textMuted }}
                className="text-[11px] font-semibold uppercase tracking-[0.08em] block"
              >
                Loyalty Sales
              </span>
              <div
                style={{ color: theme.textPrimary }}
                className="text-2xl sm:text-3xl font-display font-medium"
              >
                ₹8.4L
              </div>
              <span style={{ color: theme.textSecondary }} className="text-[12px] block">
                Attributed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. CUSTOMER VISUALIZATION: Relationships, Segments & Avatars
      ───────────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: theme.bgSurface,
          borderColor: theme.border,
        }}
        className="rounded-xl border p-6 sm:p-7 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 stroke-[1.75]" style={{ color: theme.accent }} />
              <h2
                style={{ color: theme.textPrimary }}
                className="text-[16px] font-medium"
              >
                Your Customers
              </h2>
            </div>
            <p style={{ color: theme.textSecondary }} className="text-[13px] mt-0.5">
              Active engagement across key dining segments this month
            </p>
          </div>

          <button
            onClick={onNavigateCustomers}
            style={{ color: theme.accent }}
            className="text-[13px] font-medium flex items-center gap-1 hover:underline cursor-pointer self-start sm:self-auto"
          >
            <span>View all 2,540 customers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sophisticated Segment Proportion Bar */}
        <div className="space-y-2">
          <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-black/5 gap-0.5">
            <div style={{ width: '72%', backgroundColor: theme.accent }} title="Returning: 72%" />
            <div style={{ width: '16%', backgroundColor: theme.accentGreen }} title="New: 16%" />
            <div style={{ width: '12%', backgroundColor: theme.accentAmber }} title="At risk: 12%" />
          </div>

          {/* 3 Interactive Cohort Cards with Avatars & Context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {customerSegments.map((segment, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: theme.bgSubtle,
                  borderColor: theme.borderSubtle,
                }}
                className="p-4 rounded-lg border transition-colors hover:border-black/15"
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span
                      style={{ color: theme.textPrimary }}
                      className="text-[14px] font-medium"
                    >
                      {segment.title}
                    </span>
                  </div>
                  <span
                    style={{ color: theme.textPrimary }}
                    className="text-[14px] font-semibold font-display"
                  >
                    {segment.percentage}
                  </span>
                </div>

                <p
                  style={{ color: theme.textSecondary }}
                  className="text-[12px] mt-1.5"
                >
                  {segment.description}
                </p>

                {/* Customer relationship avatars */}
                <div className="pt-3.5 flex items-center justify-between border-t border-black/5 mt-3">
                  <div className="flex -space-x-1.5">
                    {segment.customers.map((c, cIdx) => (
                      <div
                        key={cIdx}
                        style={{
                          backgroundColor: theme.bgSurface,
                          color: theme.textPrimary,
                          borderColor: theme.border,
                        }}
                        className="w-6 h-6 rounded-full border text-[9px] font-medium flex items-center justify-center shadow-2xs"
                        title={c.name}
                      >
                        {c.initials}
                      </div>
                    ))}
                  </div>
                  <span
                    style={{
                      color: segment.color,
                    }}
                    className="text-[11px] font-medium"
                  >
                    {segment.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TWO-COLUMN OPERATIONAL HUB:
             Customer Activity (Today's Actions) + Customers to Pay Attention To
      ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Left Column (7 cols): CUSTOMER ACTIVITY ("Today's Actions") */}
        <div
          style={{
            backgroundColor: theme.bgSurface,
            borderColor: theme.border,
          }}
          className="lg:col-span-7 rounded-xl border p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4"
        >
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2
                style={{ color: theme.textPrimary }}
                className="text-[16px] font-medium"
              >
                Recent customer activity
              </h2>
              <p style={{ color: theme.textSecondary }} className="text-[12px]">
                Today's actions in your cafe
              </p>
            </div>
            <span
              style={{
                backgroundColor: theme.accentLight,
                color: theme.accent,
              }}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full"
            >
              Live Feed
            </span>
          </div>

          <div
            style={{ borderColor: theme.borderSubtle }}
            className="divide-y divide-[#EFECE5]"
          >
            {activityItems.map(item => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-3 group hover:bg-black/1 transition-colors -mx-2 px-2 rounded-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Human Avatar Initials */}
                  <div
                    style={{
                      backgroundColor: item.avatarBg,
                      color: item.avatarColor,
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-medium text-[11px] shrink-0"
                  >
                    {item.initials}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span
                        style={{ color: theme.textPrimary }}
                        className="text-[13px] font-medium truncate"
                      >
                        {item.name}
                      </span>
                      <span
                        style={{ color: theme.textSecondary }}
                        className="text-[12px] truncate"
                      >
                        {item.action}
                      </span>
                    </div>
                    <span
                      style={{ color: theme.textMuted }}
                      className="text-[11px] block truncate"
                    >
                      {item.detail} • {item.time}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    style={{
                      color: item.isPositive ? theme.accentGreen : theme.accentAmber,
                    }}
                    className="text-[12px] font-medium block"
                  >
                    {item.pointsDelta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t" style={{ borderColor: theme.borderSubtle }}>
            <button
              onClick={onNavigateCustomers}
              style={{ color: theme.textSecondary }}
              className="w-full text-center py-1.5 text-[12px] font-medium hover:opacity-80 transition-opacity cursor-pointer"
            >
              View complete activity history &rarr;
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): CUSTOMER OPPORTUNITIES ("Customers to Pay Attention To") */}
        <div
          style={{
            backgroundColor: theme.bgSurface,
            borderColor: theme.border,
          }}
          className="lg:col-span-5 rounded-xl border p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4"
        >
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 stroke-[1.75]" style={{ color: theme.accentAmber }} />
              <h2
                style={{ color: theme.textPrimary }}
                className="text-[16px] font-medium"
              >
                Customers to pay attention to
              </h2>
            </div>
            <p style={{ color: theme.textSecondary }} className="text-[12px] mt-0.5">
              Retention opportunities based on visit patterns
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Opportunity 1: 18 customers haven't returned */}
            <div
              style={{
                backgroundColor: theme.bgSubtle,
                borderColor: theme.borderSubtle,
              }}
              className="p-4 rounded-lg border space-y-2.5 transition-colors hover:border-black/15"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    style={{
                      backgroundColor: theme.accentAmberBg,
                      color: theme.accentAmber,
                    }}
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      style={{ color: theme.textPrimary }}
                      className="text-[13px] font-semibold block"
                    >
                      18 customers haven't returned
                    </span>
                    <span
                      style={{ color: theme.textSecondary }}
                      className="text-[12px] block mt-0.5 leading-snug"
                    >
                      They normally visit every 2–3 weeks. Sending a gentle perk recovers up to 35% of guests.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span style={{ color: theme.accentAmber }} className="text-[11px] font-medium">
                  30+ days inactive
                </span>
                <button
                  onClick={onNavigateCustomers}
                  style={{
                    backgroundColor: theme.bgSurface,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  }}
                  className="px-3 py-1 rounded-md text-[11px] font-medium border hover:bg-black/2 transition-colors cursor-pointer shadow-2xs"
                >
                  View customers
                </button>
              </div>
            </div>

            {/* Opportunity 2: 7 customers close to reward */}
            <div
              style={{
                backgroundColor: theme.bgSubtle,
                borderColor: theme.borderSubtle,
              }}
              className="p-4 rounded-lg border space-y-2.5 transition-colors hover:border-black/15"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    style={{
                      backgroundColor: theme.accentLight,
                      color: theme.accent,
                    }}
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  >
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      style={{ color: theme.textPrimary }}
                      className="text-[13px] font-semibold block"
                    >
                      7 customers close to a reward
                    </span>
                    <span
                      style={{ color: theme.textSecondary }}
                      className="text-[12px] block mt-0.5 leading-snug"
                    >
                      Within 50 points of unlocking ₹100 OFF. High likelihood of visiting this weekend.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span style={{ color: theme.accent }} className="text-[11px] font-medium">
                  High conversion
                </span>
                <button
                  onClick={onNavigateCustomers}
                  style={{
                    backgroundColor: theme.bgSurface,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  }}
                  className="px-3 py-1 rounded-md text-[11px] font-medium border hover:bg-black/2 transition-colors cursor-pointer shadow-2xs"
                >
                  View customers
                </button>
              </div>
            </div>

            {/* Opportunity 3: 12 new members this week */}
            <div
              style={{
                backgroundColor: theme.bgSubtle,
                borderColor: theme.borderSubtle,
              }}
              className="p-4 rounded-lg border space-y-2.5 transition-colors hover:border-black/15"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    style={{
                      backgroundColor: theme.accentGreenBg,
                      color: theme.accentGreen,
                    }}
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span
                      style={{ color: theme.textPrimary }}
                      className="text-[13px] font-semibold block"
                    >
                      12 new loyalty members this week
                    </span>
                    <span
                      style={{ color: theme.textSecondary }}
                      className="text-[12px] block mt-0.5 leading-snug"
                    >
                      Joined recently. A 2nd-visit bounceback reward helps turn newcomers into regulars.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span style={{ color: theme.accentGreen }} className="text-[11px] font-medium">
                  New member boost
                </span>
                <button
                  onClick={onNavigateCustomers}
                  style={{
                    backgroundColor: theme.bgSurface,
                    color: theme.textPrimary,
                    borderColor: theme.border,
                  }}
                  className="px-3 py-1 rounded-md text-[11px] font-medium border hover:bg-black/2 transition-colors cursor-pointer shadow-2xs"
                >
                  Review members
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
