import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { getThemeById } from './data/themes';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/layout/ToastContainer';
import { LoginPage } from './components/auth/LoginPage';
import { UserManagementView } from './components/auth/UserManagementView';
import { DashboardView } from './components/dashboard/DashboardView';
import { OfferingsView } from './components/offerings/OfferingsView';
import { BillingManagerView } from './components/billing/BillingManagerView';
import { MemberManagementView } from './components/members/MemberManagementView';
import { LeadMarketingView } from './components/leads/LeadMarketingView';
import { ScheduleCalendarView } from './components/schedule/ScheduleCalendarView';
import { PointOfSaleView } from './components/pos/PointOfSaleView';
import { TransactionManagerView } from './components/transactions/TransactionManagerView';
import { ReportsView } from './components/reports/ReportsView';
import { DedicatedRegistrationModal } from './components/registration/DedicatedRegistrationModal';
import { QuickTrialLeadModal } from './components/leads/QuickTrialLeadModal';

const MainLayout: React.FC = () => {
  const { 
    currentTab, 
    selectedOfferingForReg, 
    closeRegistrationFlow, 
    currentUser, 
    currentTheme 
  } = useApp();

  const [showQuickLeadModal, setShowQuickLeadModal] = useState(false);
  const activeThemeConfig = getThemeById(currentTheme);

  // If user is not authenticated, render Login Page
  if (!currentUser) {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className={`flex min-h-screen bg-gradient-to-br ${activeThemeConfig.bgGradient} text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans transition-colors duration-500`}>
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenQuickLeadModal={() => setShowQuickLeadModal(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && <DashboardView />}
          {currentTab === 'offerings' && <OfferingsView />}
          {currentTab === 'billing' && <BillingManagerView />}
          {currentTab === 'members' && <MemberManagementView />}
          {currentTab === 'leads' && (
            <LeadMarketingView onOpenQuickLeadModal={() => setShowQuickLeadModal(true)} />
          )}
          {currentTab === 'schedule' && <ScheduleCalendarView />}
          {currentTab === 'pos' && <PointOfSaleView />}
          {currentTab === 'transactions' && <TransactionManagerView />}
          {currentTab === 'reports' && <ReportsView />}
          {currentTab === 'users' && <UserManagementView />}
        </main>
      </div>

      {/* Dedicated Registration Modal Flow */}
      {selectedOfferingForReg && (
        <DedicatedRegistrationModal
          offering={selectedOfferingForReg}
          onClose={closeRegistrationFlow}
        />
      )}

      {/* Quick Trial Lead Capture Modal */}
      {showQuickLeadModal && (
        <QuickTrialLeadModal onClose={() => setShowQuickLeadModal(false)} />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
