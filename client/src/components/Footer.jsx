import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* サイト情報 */}
          <div className="footer-section">
            <h3 className="footer-title">全国メンズエステ検索ランキング</h3>
            <p className="footer-description">
              全国のメンズエステ・メンエス店舗を検索できるランキングサイトです。
              クリック数に基づいた公平なランキングで、あなたにぴったりの店舗を見つけましょう。
            </p>
          </div>

          {/* サイトマップ */}
          <div className="footer-section">
            <h4 className="footer-subtitle">サイトマップ</h4>
            <ul className="footer-links">
              <li><Link to="/">トップページ</Link></li>
              <li><Link to="/ranking">総合ランキングベスト100</Link></li>
            </ul>
          </div>

          {/* 人気エリア */}
          <div className="footer-section">
            <h4 className="footer-subtitle">人気エリア</h4>
            <ul className="footer-links">
              <li><Link to="/areas/tokyo-shinjuku">新宿</Link></li>
              <li><Link to="/areas/tokyo-ikebukuro">池袋</Link></li>
              <li><Link to="/areas/tokyo-shibuya">渋谷</Link></li>
              <li><Link to="/areas/kanagawa-yokohama">横浜</Link></li>
              <li><Link to="/areas/osaka-umeda">梅田</Link></li>
              <li><Link to="/areas/fukuoka-hakata">博多</Link></li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="footer-bottom">
          <p>&copy; 2024 全国メンズエステ検索ランキング. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
