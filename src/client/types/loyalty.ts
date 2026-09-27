/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LoyaltyProgramConfig {
  id: string;
  name: string;
  pointsRatio: number; // e.g., 5 points per ₹100 => 0.05
  pointsPerUnitCurrency: number; // 5
  currencyUnit: number; // 100
  welcomeBonusPoints: number;
  referralBonusPoints: number;
  status: 'ACTIVE' | 'PAUSED';
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  discountType: 'FLAT' | 'PERCENT' | 'FREE_ITEM';
  discountValue?: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  redemptionCount: number;
}

export interface CustomerActivityRecord {
  id: string;
  customerId: string;
  customerName: string;
  type: 'PURCHASE' | 'POINTS_EARNED' | 'REWARD_REDEEMED' | 'JOINED' | 'TIER_UPGRADE';
  description: string;
  pointsDelta: number;
  billAmount?: number;
  timestamp: string;
  relativeTime: string;
}

export interface PurchaseTransactionInput {
  customerId: string;
  customerName?: string;
  phone?: string;
  billAmount: number;
  notes?: string;
}
