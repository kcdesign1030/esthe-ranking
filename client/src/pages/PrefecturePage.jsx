import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import ShopCard from '../components/ShopCard';
import Footer from '../components/Footer';
import { shopsAPI, prefecturesAPI, subAreasAPI } from '../utils/api';
import '../styles/PrefecturePage.css';

const PrefecturePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [prefecture, setPrefecture] = useState(null);
  const [subAreas, setSubAreas] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 都道府県情報を取得
      const prefecturesRes = await prefecturesAPI.getAll();
      const foundPrefecture = prefecturesRes.data.find(pref => pref.slug === slug);

      if (!foundPrefecture) {
        setError('都道府県が見つかりません');
        setLoading(false);
        return;
      }

      setPrefecture(foundPrefecture);

      // 小エリアを取得
      const subAreasRes = await subAreasAPI.getAll();
      const prefectureSubAreas = subAreasRes.data.filter(
        area => area.prefectureId === foundPrefecture.id
      );
      setSubAreas(prefectureSubAreas);

      // 店舗を取得
      const shopsRes = await shopsAPI.getAll({ prefectureId: foundPrefecture.id });
      setShops(shopsRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('データの取得に失敗しました');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="prefecture-page">
        <Header />
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  if (error || !prefecture) {
    return (
      <div className="prefecture-page">
        <Header />
        <div className="container">
          <div className="error-message">
            <h2>都道府県が見つかりません</h2>
            <p>指定された都道府県は存在しないか、削除された可能性があります。</p>
            <button onClick={() => navigate('/')} className="back-button">
              ホームに戻る
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="prefecture-page">
      <Header />
      
      {/* パンくずリスト */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">トップ</Link>
          <span> › </span>
          <span>{prefecture.name}</span>
        </div>
      </div>

      {/* ページヘッダー */}
      <div className="page-header">
        <div className="container">
          <button onClick={() => navigate(-1)} className="back-button">
            ← 戻る
          </button>
          <h1>📍 {prefecture.name}のメンズエステ・メンエスランキング</h1>
        </div>
      </div>

      <div className="container">
        {/* エリア一覧 */}
        {subAreas.length > 0 && (
          <div className="areas-section">
            <h2>🗺️ {prefecture.name}のエリア一覧</h2>
            <div className="areas-grid">
              {subAreas.map((area) => (
                <Link
                  key={area.id}
                  to={`/areas/${area.slug}`}
                  className="area-card"
                >
                  <span className="area-name">{area.name}</span>
                  <span className="area-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 店舗ランキング */}
        <div className="ranking-section">
          <h2>🏪 {prefecture.name}メンズエステ店舗ランキング（{shops.length}件）</h2>
          
          {shops.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏪</div>
              <p>{prefecture.name}の店舗はまだ登録されていません</p>
            </div>
          ) : (
            <div className="shops-list">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrefecturePage;
