import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import ShopCard from '../components/ShopCard';
import Footer from '../components/Footer';
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

  // 人気エリア（14エリア）
  const popularAreas = [
    { name: '新宿', slug: 'tokyo-shinjuku' },
    { name: '池袋', slug: 'tokyo-ikebukuro' },
    { name: '渋谷', slug: 'tokyo-shibuya' },
    { name: '五反田', slug: 'tokyo-gotanda' },
    { name: '上野', slug: 'tokyo-ueno' },
    { name: '横浜', slug: 'kanagawa-yokohama' },
    { name: '川崎', slug: 'kanagawa-kawasaki' },
    { name: '梅田', slug: 'osaka-umeda' },
    { name: '難波', slug: 'osaka-namba' },
    { name: '栄', slug: 'aichi-sakae' },
    { name: '名駅', slug: 'aichi-meieki' },
    { name: '博多', slug: 'fukuoka-hakata' },
    { name: 'すすきの', slug: 'hokkaido-susukino' },
    { name: '仙台', slug: 'miyagi-sendai' },
  ];

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

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="home">
      <Header />
      
      <div className="hero">
        <div className="container">
          <h1>全国メンズエステ検索ランキング</h1>
          <p>都道府県・エリア別に検索できます</p>
          
          <div className="search-bar">
            <input
              type="text"
              placeholder="店舗名、エリア名で検索"
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            />
            <button onClick={fetchShops}>検索</button>
          </div>
        </div>
      </div>

      <div className="container">
        {/* 人気エリア */}
        <section className="popular-areas">
          <h2>🔥 人気エリアから探す</h2>
          <div className="areas-grid">
            {popularAreas.map((area) => (
              <Link
                key={area.slug}
                to={`/areas/${area.slug}`}
                className="area-button"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </section>

        {/* 都道府県一覧 */}
        <section className="prefectures-section">
          <h2>📍 都道府県から探す</h2>
          <div className="prefectures-grid">
            {prefectures.map((pref) => (
              <Link
                key={pref.id}
                to={`/prefecture/${pref.slug}`}
                className="prefecture-button"
              >
                {pref.name}
              </Link>
            ))}
          </div>
        </section>

        {/* 総合ランキング */}
        <section className="ranking-section">
          <h2>🏆 総合ランキングベスト20</h2>
          <p className="ranking-subtitle">全{shops.length}件の店舗から上位20件を表示</p>
          {shops.length === 0 ? (
            <div className="no-results">店舗が見つかりませんでした</div>
          ) : (
            <div className="shops-list">
              {shops.slice(0, 20).map((shop, index) => (
                <ShopCard key={shop.id} shop={shop} rank={index + 1} />
              ))}
            </div>
          )}
          <div className="view-all">
            <Link to="/ranking" className="view-all-button">
              総合ランキングベスト100を見る →
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
