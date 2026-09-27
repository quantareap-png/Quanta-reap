/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './client/context/AuthContext';
import { ThemeProvider, useTheme } from './client/context/ThemeContext';
import { Sidebar, NavItemKey } from './client/components/Sidebar';
import { TopBar } from './client/components/TopBar';
import { AddPurchaseModal } from './client/components/AddPurchaseModal';
import { LoginPage } from './client/pages/LoginPage';
import { RegisterPage } from './client/pages/RegisterPage';
import { MerchantDashboard } from './client/pages/MerchantDashboard';
import { ModernCustomersPage } from './client/pages/ModernCustomersPage';
import { LoyaltyPage } from './client/pages/LoyaltyPage';
import { RewardsPage } from './client/pages/RewardsPage';
import { CampaignsPage } from './client/pages/CampaignsPage';
import { InsightsPage } from './client/pages/InsightsPage';
import { SettingsPage } from './client/pages/SettingsPage';
import { HelpPage } from './client/pages/HelpPage';
import { Customer } from './client/types/customer';

function AppShell() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentTab, setCurrentTab] = useState<NavItemKey>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addPurchaseOpen, setAddPurchaseOpen] = useState(false);
  const [preselectedCustomer, setPreselectedCustomer] = useState<Customer | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#18181B] flex items-center justify-center text-white font-bold text-xl shadow-xs">
            Q
          </div>
          <div className="flex items-center gap-2 text-xs text-[#71717A] font-medium">
            <div className="w-4 h-4 border-2 border-[#18181B] border-t-transparent rounded-full animate-spin" />
            <span>Loading Quanta merchant workspace...</span>
          </div>
        </div>
      </div>
    );
  }

  // Unauthenticated user -> Show Login / Register
  if (!user) {
    if (authView === 'register') {
      return <RegisterPage onNavigateLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onNavigateRegister={() => setAuthView('register')} />;
  }

  const handleOpenPurchaseWithCustomer = (customer: Customer) => {
    setPreselectedCustomer(customer);
    setAddPurchaseOpen(true);
  };

  const getPageTitle = (tab: NavItemKey): string => {
    switch (tab) {
      case 'overview':
        return 'Overview';
      case 'customers':
        return 'Customers';
      case 'loyalty':
        return 'Loyalty';
      case 'rewards':
        return 'Rewards';
      case 'campaigns':
        return 'Campaigns';
      case 'insights':
        return 'Insights';
      case 'settings':
        return 'Settings';
      case 'help':
        return 'Help & Guides';
      default:
        return 'Overview';
    }
  };

  const { theme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme.bgApp,
        color: theme.textPrimary,
      }}
      className="min-h-screen flex transition-colors"
    >
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onOpenAddPurchase={() => {
          setPreselectedCustomer(null);
          setAddPurchaseOpen(true);
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopBar
          pageTitle={getPageTitle(currentTab)}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 pb-16">
          {currentTab === 'overview' && (
            <MerchantDashboard
              onOpenAddPurchase={() => {
                setPreselectedCustomer(null);
                setAddPurchaseOpen(true);
              }}
              onNavigateCustomers={() => setCurrentTab('customers')}
              onNavigateRewards={() => setCurrentTab('rewards')}
              onNavigateLoyalty={() => setCurrentTab('loyalty')}
            />
          )}

          {currentTab === 'customers' && (
            <ModernCustomersPage
              onOpenAddPurchaseWithCustomer={handleOpenPurchaseWithCustomer}
            />
          )}

          {currentTab === 'loyalty' && <LoyaltyPage />}

          {currentTab === 'rewards' && <RewardsPage />}

          {currentTab === 'campaigns' && <CampaignsPage />}

          {currentTab === 'insights' && <InsightsPage />}

          {currentTab === 'settings' && <SettingsPage />}

          {currentTab === 'help' && <HelpPage />}
        </main>
      </div>

      {/* Fast In-Store Add Purchase Staff Modal */}
      <AddPurchaseModal
        isOpen={addPurchaseOpen}
        onClose={() => setAddPurchaseOpen(false)}
        preselectedCustomer={preselectedCustomer}
        onPurchaseSuccess={_receipt => {
          // Can refresh feed or state seamlessly
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
