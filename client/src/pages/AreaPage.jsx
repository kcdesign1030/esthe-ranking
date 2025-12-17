import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import ShopCard from '../components/ShopCard';
import Footer from '../components/Footer';
import { shopsAPI, subAreasAPI } from '../utils/api';
import '../styles/AreaPage.css';

const AreaPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [subArea, setSubArea] = useState(null);
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

      // エリア情報を取得
      const subAreasRes = await subAreasAPI.getAll();
      const foundSubArea = subAreasRes.data.find(area => area.slug === slug);

      if (!foundSubArea) {
        setError('エリアが見つかりません');
        setLoading(false);
        return;
      }

      setSubArea(foundSubArea);

      // 店舗を取得
      const shopsRes = await shopsAPI.getAll({ subAreaId: foundSubArea.id });
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
      <div className="area-page">
        <Header />
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  if (error || !subArea) {
    return (
      <div className="area-page">
        <Header />
        <div className="container">
          <div className="error-message">
            <h2>エリアが見つかりません</h2>
            <p>指定されたエリアは存在しないか、削除された可能性があります。</p>
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
    <div className="area-page">
      <Header />
      
      {/* パンくずリスト */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/">トップ</Link>
          <span> › </span>
          <span>{subArea.name}</span>
        </div>
      </div>

      {/* ページヘッダー */}
      <div className="page-header">
        <div className="container">
          <button onClick={() => navigate(-1)} className="back-button">
            ← 戻る
          </button>
          <h1>📍 {subArea.name}のメンズエステ・メンエスランキング</h1>
        </div>
      </div>

      <div className="container">
        {/* SEOコンテンツ */}
        <div className="seo-content">
          <h2>{subArea.name}メンズエステ・メンエスの特徴</h2>
          <p>
            {subArea.name}エリアは、多くのメンズエステ店が集まる人気エリアです。
            当サイトでは、ユーザーの動きを集計し、独自のアルゴリズムにて公平に順位を決定しています。
          </p>
        </div>

        {/* 店舗ランキング */}
        <div className="ranking-section">
          <h2>🏪 {subArea.name}メンズエステ店舗ランキング（{shops.length}件）</h2>
          
          {shops.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏪</div>
              <p>{subArea.name}の店舗はまだ登録されていません</p>
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

export default AreaPage;
