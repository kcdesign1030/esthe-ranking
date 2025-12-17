import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { prefecturesAPI } from '../../utils/api';
import '../../styles/admin/Common.css';

const AdminPrefectures = () => {
  const [prefectures, setPrefectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await prefecturesAPI.getAll();
      setPrefectures(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prefectures:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await prefecturesAPI.update(editingItem.id, formData);
      } else {
        await prefecturesAPI.create(formData);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving prefecture:', error);
      alert('保存に失敗しました');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      await prefecturesAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting prefecture:', error);
      alert('削除に失敗しました');
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
      <div className="admin-page">
        <div className="page-header">
          <h1>都道府県管理</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + 新規追加
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>都道府県名</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {prefectures.map((pref) => (
                <tr key={pref.id}>
                  <td>{pref.id}</td>
                  <td>{pref.name}</td>
                  <td>
                    <button onClick={() => handleEdit(pref)} className="btn btn-sm btn-secondary">
                      編集
                    </button>
                    <button onClick={() => handleDelete(pref.id)} className="btn btn-sm btn-danger">
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingItem ? '都道府県編集' : '都道府県追加'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>都道府県名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                    キャンセル
                  </button>
                  <button type="submit" className="btn btn-primary">
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPrefectures;
