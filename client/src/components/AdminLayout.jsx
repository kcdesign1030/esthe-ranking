import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/admin/AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>管理画面</h2>
          <p>{user?.email}</p>
        </div>
        <nav className="sidebar-nav">
          <Link
            to="/admin/dashboard"
            className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
          >
            📊 ダッシュボード
          </Link>
          <Link
            to="/admin/shops"
            className={`nav-item ${isActive('/admin/shops') ? 'active' : ''}`}
          >
            🏪 店舗管理
          </Link>
          <Link
            to="/admin/prefectures"
            className={`nav-item ${isActive('/admin/prefectures') ? 'active' : ''}`}
          >
            🗾 都道府県管理
          </Link>
          <Link
            to="/admin/subareas"
            className={`nav-item ${isActive('/admin/subareas') ? 'active' : ''}`}
          >
            📍 小エリア管理
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-secondary logout-btn">
            ログアウト
          </button>
          <Link to="/" className="btn btn-secondary">
            公開ページへ
          </Link>
        </div>
      </aside>
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
