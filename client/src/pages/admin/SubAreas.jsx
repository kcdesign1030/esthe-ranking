import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { subAreasAPI, prefecturesAPI } from '../../utils/api';
import '../../styles/admin/Common.css';

const AdminSubAreas = () => {
  const [subAreas, setSubAreas] = useState([]);
  const [prefectures, setPrefectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', prefectureId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subAreasRes, prefecturesRes] = await Promise.all([
        subAreasAPI.getAll(),
        prefecturesAPI.getAll(),
      ]);
      setSubAreas(subAreasRes.data);
      setPrefectures(prefecturesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        prefectureId: parseInt(formData.prefectureId),
      };

      if (editingItem) {
        await subAreasAPI.update(editingItem.id, data);
      } else {
        await subAreasAPI.create(data);
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ name: '', prefectureId: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving sub area:', error);
      alert('保存に失敗しました');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, prefectureId: item.prefectureId });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      await subAreasAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting sub area:', error);
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
          <h1>小エリア管理</h1>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + 新規追加
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>小エリア名</th>
                <th>都道府県</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {subAreas.map((area) => (
                <tr key={area.id}>
                  <td>{area.id}</td>
                  <td>{area.name}</td>
                  <td>{area.prefectureName}</td>
                  <td>
                    <button onClick={() => handleEdit(area)} className="btn btn-sm btn-secondary">
                      編集
                    </button>
                    <button onClick={() => handleDelete(area.id)} className="btn btn-sm btn-danger">
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
              <h2>{editingItem ? '小エリア編集' : '小エリア追加'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>都道府県 *</label>
                  <select
                    value={formData.prefectureId}
                    onChange={(e) => setFormData({ ...formData, prefectureId: e.target.value })}
                    required
                  >
                    <option value="">選択してください</option>
                    {prefectures.map((pref) => (
                      <option key={pref.id} value={pref.id}>
                        {pref.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>小エリア名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

export default AdminSubAreas;
