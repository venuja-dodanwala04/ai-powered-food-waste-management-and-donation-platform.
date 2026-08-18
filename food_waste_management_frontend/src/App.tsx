import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { BusinessLayout } from './layouts/BusinessLayout';
import { CharityLayout } from './layouts/CharityLayout';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Business Pages
import { DashboardPage as BusinessDashboard } from './pages/business/DashboardPage';
import { ForecastPage } from './pages/business/ForecastPage';
import { InventoryPage } from './pages/business/InventoryPage';
import { SalesPage } from './pages/business/SalesPage';
import { WastePage } from './pages/business/WastePage';
import { ExpiryPage } from './pages/business/ExpiryPage';
import { DonationsPage } from './pages/business/DonationsPage';
import { DonationRequestsPage } from './pages/business/DonationRequestsPage';
import { CharityMapPage as BusinessCharityMap } from './pages/business/CharityMapPage';
import { ReportsPage } from './pages/business/ReportsPage';
import { NotificationsPage as BusinessNotifications } from './pages/business/NotificationsPage';
import { ProfilePage as BusinessProfile } from './pages/business/ProfilePage';

// Charity Pages
import { CharityDashboardPage } from './pages/charity/CharityDashboardPage';
import { AvailableDonationsPage } from './pages/charity/AvailableDonationsPage';
import { CharityMapPage } from './pages/charity/CharityMapPage';
import { CharityRequestsPage } from './pages/charity/CharityRequestsPage';
import { CollectionsPage } from './pages/charity/CollectionsPage';
import { CharityHistoryPage } from './pages/charity/CharityHistoryPage';
import { CharityNotificationsPage } from './pages/charity/CharityNotificationsPage';
import { ProfilePage as CharityProfile } from './pages/charity/ProfilePage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<LoginPage />} />
          <Route path="/reset-password" element={<LoginPage />} />
        </Route>

        {/* FOOD BUSINESS ROUTES */}
        <Route path="/business" element={<BusinessLayout />}>
          <Route index element={<Navigate to="/business/dashboard" replace />} />
          <Route path="dashboard" element={<BusinessDashboard />} />
          <Route path="forecast" element={<ForecastPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="waste" element={<WastePage />} />
          <Route path="expiry" element={<ExpiryPage />} />
          <Route path="donations" element={<DonationsPage />} />
          <Route path="donation-requests" element={<DonationRequestsPage />} />
          <Route path="charity-map" element={<BusinessCharityMap />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<BusinessNotifications />} />
          <Route path="profile" element={<BusinessProfile />} />
          <Route path="settings" element={<BusinessProfile />} />
        </Route>

        {/* CHARITY / NGO ROUTES */}
        <Route path="/charity" element={<CharityLayout />}>
          <Route index element={<Navigate to="/charity/dashboard" replace />} />
          <Route path="dashboard" element={<CharityDashboardPage />} />
          <Route path="donations" element={<AvailableDonationsPage />} />
          <Route path="map" element={<CharityMapPage />} />
          <Route path="requests" element={<CharityRequestsPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="history" element={<CharityHistoryPage />} />
          <Route path="notifications" element={<CharityNotificationsPage />} />
          <Route path="profile" element={<CharityProfile />} />
        </Route>

        {/* CATCH-ALL REDIRECT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
