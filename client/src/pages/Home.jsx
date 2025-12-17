import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { shopsAPI, prefecturesAPI, subAreasAPI } from '../utils/api';
import '../styles/Home.css';

const Home = () => {
  const [shops, setShops] = useState([]);
  const [prefectures, setPrefectures] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    prefectureId: '',
    subAreaId: '',
    keyword: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchShops();
  }, [filters]);

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

  const fetchShops = async () => {
    try {
      const params = {};
      if (filters.prefectureId) params.prefectureId = filters.prefectureId;
      if (filters.subAreaId) params.subAreaId = filters.subAreaId;
      if (filters.keyword) params.keyword = filters.keyword;

      const response = await shopsAPI.getAll(params);
      setShops(response.data);
    } catch (error) {
      console.error('Error fetching shops:', error);
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

  const handlePrefectureChange = (e) => {
    const prefectureId = e.target.value;
    setFilters({ ...filters, prefectureId, subAreaId: '' });
    if (prefectureId) {
      fetchSubAreas(prefectureId);
    } else {
      setSubAreas([]);
    }
  };

  const handleClick = async (shopId, url) => {
    try {
      await shopsAPI.click(shopId);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error recording click:', error);
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="home">
      <Header />
      
      <div className="hero">
        <div className="container">
          <h2>全国のエステサロンをランキング形式でご紹介</h2>
          <p>都道府県・エリア別に検索できます</p>
        </div>
      </div>

      <div className="container">
        <div className="filters card">
          <div className="filter-group">
            <label>都道府県</label>
            <select
              value={filters.prefectureId}
              onChange={handlePrefectureChange}
            >
              <option value="">すべて</option>
              {prefectures.map((pref) => (
                <option key={pref.id} value={pref.id}>
                  {pref.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>小エリア</label>
            <select
              value={filters.subAreaId}
              onChange={(e) => setFilters({ ...filters, subAreaId: e.target.value })}
              disabled={!filters.prefectureId}
            >
              <option value="">すべて</option>
              {subAreas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>キーワード検索</label>
            <input
              type="text"
              placeholder="店舗名、エリア名で検索"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            />
          </div>
        </div>

        <div className="shops-list">
          <h3>店舗一覧（{shops.length}件）</h3>
          {shops.length === 0 ? (
            <div className="no-results">該当する店舗が見つかりませんでした</div>
          ) : (
            <div className="shops-grid">
              {shops.map((shop, index) => (
                <div key={shop.id} className={`shop-card ${shop.isPremium ? 'premium' : ''}`}>
                  <div className="shop-rank">{index + 1}位</div>
                  {shop.isPremium && <div className="badge badge-premium">PREMIUM</div>}
                  {shop.imageUrl && (
                    <img src={shop.imageUrl} alt={shop.name} className="shop-image" />
                  )}
                  <div className="shop-info">
                    <h4>
                      {shop.name}
                      <span className="badge badge-store">🏠 店舗</span>
                    </h4>
                    <p className="shop-location">
                      {shop.prefectureName}
                      {shop.subAreaName && ` / ${shop.subAreaName}`}
                    </p>
                    {shop.description && (
                      <p className="shop-description">{shop.description}</p>
                    )}
                    {shop.address && (
                      <p className="shop-address">📍 {shop.address}</p>
                    )}
                    {shop.phone && (
                      <p className="shop-phone">📞 {shop.phone}</p>
                    )}

                    {shop.url && (
                      <button
                        className="btn btn-primary shop-link"
                        onClick={() => handleClick(shop.id, shop.url)}
                      >
                        公式サイトを見る
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
