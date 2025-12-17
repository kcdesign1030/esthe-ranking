import { useState, useEffect } from 'react';
import Header from '../components/Header';
import ShopCard from '../components/ShopCard';
import { shopsAPI, prefecturesAPI, subAreasAPI } from '../utils/api';
import '../styles/Home.css';
import '../styles/ShopCard.css';

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
                <ShopCard key={shop.id} shop={shop} rank={index + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
