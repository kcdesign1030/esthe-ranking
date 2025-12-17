import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminShops from './pages/admin/Shops';
import AdminPrefectures from './pages/admin/Prefectures';
import AdminSubAreas from './pages/admin/SubAreas';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 公開ページ */}
        <Route path="/" element={<Home />} />

        {/* 管理画面 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/shops"
          element={
            <PrivateRoute>
              <AdminShops />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/prefectures"
          element={
            <PrivateRoute>
              <AdminPrefectures />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/subareas"
          element={
            <PrivateRoute>
              <AdminSubAreas />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
