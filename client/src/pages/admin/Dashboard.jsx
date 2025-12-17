import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { statsAPI } from '../../utils/api';
import '../../styles/admin/Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsAPI.getDashboard();
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">読み込み中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard">
        <h1>ダッシュボード</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div className="stat-info">
              <h3>総店舗数</h3>
              <p className="stat-value">{stats?.totalShops || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>有料プラン店舗</h3>
              <p className="stat-value">{stats?.premiumShops || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👆</div>
            <div className="stat-info">
              <h3>総クリック数</h3>
              <p className="stat-value">{stats?.totalClicks || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>今日のクリック</h3>
              <p className="stat-value">{stats?.todayClicks || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🗾</div>
            <div className="stat-info">
              <h3>都道府県数</h3>
              <p className="stat-value">{stats?.totalPrefectures || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-info">
              <h3>小エリア数</h3>
              <p className="stat-value">{stats?.totalSubAreas || 0}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-actions">
          <h2>クイックアクション</h2>
          <div className="action-buttons">
            <a href="/admin/shops" className="btn btn-primary">
              新しい店舗を追加
            </a>
            <a href="/admin/prefectures" className="btn btn-secondary">
              都道府県を管理
            </a>
            <a href="/admin/subareas" className="btn btn-secondary">
              小エリアを管理
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
