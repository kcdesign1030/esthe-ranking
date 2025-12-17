import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { shopsAPI, prefecturesAPI, subAreasAPI } from '../../utils/api';
import '../../styles/admin/Shops.css';

const AdminShops = () => {
  const [shops, setShops] = useState([]);
  const [prefectures, setPrefectures] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    prefectureId: '',
    subAreaId: '',
    address: '',
    phone: '',
    url: '',
    description: '',
    imageUrl: '',
    isPremium: false,
    serviceType: 'both',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [shopsRes, prefecturesRes] = await Promise.all([
        shopsAPI.getAll(),
        prefecturesAPI.getAll(),
      ]);
      setShops(shopsRes.data);
      setPrefectures(prefecturesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const fetchSubAreas = async (prefectureId) => {
    try {
      const response = await subAreasAPI.getAll({ prefectureId });
      setSubAreas(response.data);
    } catch (error) {
      console.error('Error fetching sub areas:', error);
    }
  };

  const handlePrefectureChange = (prefectureId) => {
    setFormData({ ...formData, prefectureId, subAreaId: '' });
    if (prefectureId) {
      fetchSubAreas(prefectureId);
    } else {
      setSubAreas([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        prefectureId: parseInt(formData.prefectureId),
        subAreaId: formData.subAreaId ? parseInt(formData.subAreaId) : null,
      };

      if (editingShop) {
        await shopsAPI.update(editingShop.id, data);
      } else {
        await shopsAPI.create(data);
      }

      setShowModal(false);
      setEditingShop(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving shop:', error);
      alert('保存に失敗しました');
    }
  };

  const handleEdit = (shop) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name,
      prefectureId: shop.prefectureId,
      subAreaId: shop.subAreaId || '',
      address: shop.address || '',
      phone: shop.phone || '',
      url: shop.url || '',
      description: shop.description || '',
      imageUrl: shop.imageUrl || '',
      isPremium: shop.isPremium,
      serviceType: shop.serviceType,
    });
    if (shop.prefectureId) {
      fetchSubAreas(shop.prefectureId);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('本当に削除しますか？')) return;

    try {
      await shopsAPI.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting shop:', error);
      alert('削除に失敗しました');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      prefectureId: '',
      subAreaId: '',
      address: '',
      phone: '',
      url: '',
      description: '',
      imageUrl: '',
      isPremium: false,
      serviceType: 'both',
    });
    setSubAreas([]);
  };

  const openAddModal = () => {
    setEditingShop(null);
    resetForm();
    setShowModal(true);
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
      <div className="admin-shops">
        <div className="page-header">
          <h1>店舗管理</h1>
          <button onClick={openAddModal} className="btn btn-primary">
            + 新規追加
          </button>
        </div>

        <div className="shops-table-container">
          <table className="shops-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>店舗名</th>
                <th>都道府県</th>
                <th>小エリア</th>
                <th>プラン</th>
                <th>クリック数</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <tr key={shop.id}>
                  <td>{shop.id}</td>
                  <td>{shop.name}</td>
                  <td>{shop.prefectureName}</td>
                  <td>{shop.subAreaName || '-'}</td>
                  <td>
                    {shop.isPremium ? (
                      <span className="badge badge-premium">有料</span>
                    ) : (
                      <span className="badge badge-free">無料</span>
                    )}
                  </td>
                  <td>{shop.clickCount}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(shop)}
                      className="btn btn-sm btn-secondary"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(shop.id)}
                      className="btn btn-sm btn-danger"
                    >
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
              <h2>{editingShop ? '店舗編集' : '店舗追加'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>店舗名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>都道府県 *</label>
                  <select
                    value={formData.prefectureId}
                    onChange={(e) => handlePrefectureChange(e.target.value)}
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
                  <label>小エリア</label>
                  <select
                    value={formData.subAreaId}
                    onChange={(e) => setFormData({ ...formData, subAreaId: e.target.value })}
                    disabled={!formData.prefectureId}
                  >
                    <option value="">選択してください</option>
                    {subAreas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>住所</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>電話番号</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>説明</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                  />
                </div>

                <div className="form-group">
                  <label>画像URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.isPremium}
                      onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })}
                    />
                    {' '}有料プラン
                  </label>
                </div>

                <div className="form-group">
                  <label>サービスタイプ</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  >
                    <option value="both">店舗型・出張型</option>
                    <option value="store">店舗型のみ</option>
                    <option value="dispatch">出張型のみ</option>
                  </select>
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

export default AdminShops;
