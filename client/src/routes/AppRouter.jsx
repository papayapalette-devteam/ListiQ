import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import ListProductPage from '../pages/ListProductPage';
import TrendingPage from '../pages/TrendingPage';
import CategoryPage from '../pages/CategoryPage';
import AdvisorPage from '../pages/AdvisorPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/list" element={<ListProductPage />} />
          <Route path="/trending" element={<TrendingPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/advisor" element={<AdvisorPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
