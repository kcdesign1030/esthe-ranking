import React from 'react';
import { shopsAPI } from '../utils/api';

const ShopCard = ({ shop, rank }) => {
  const isPremium = shop.isPremium;

  const handleClick = async () => {
    try {
      await shopsAPI.click(shop.id);
      if (shop.url) {
        window.open(shop.url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Error recording click:', error);
      if (shop.url) {
        window.open(shop.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleNameClick = async (e) => {
    e.preventDefault();
    if (shop.url) {
      try {
        await shopsAPI.click(shop.id);
        window.open(shop.url, '_blank', 'noopener,noreferrer');
      } catch (error) {
        console.error('Error recording click:', error);
        window.open(shop.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // 順位に応じた王冠の色
  const getRankStyle = (rank) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-700';
  };

  const rankStyle = getRankStyle(rank);

  // 有料掲載（プレミアム）の場合
  if (isPremium) {
    return (
      <div className="shop-card-premium">
        {/* プレミアムバッジ */}
        <div className="premium-badge">
          <svg className="crown-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
          </svg>
          PREMIUM
        </div>
        
        <div className="shop-card-content">
          {/* 左側：順位と画像 */}
          <div className="shop-image-container">
            {/* 順位バッジ */}
            <div className="rank-badge">
              <svg className={`crown-icon ${rankStyle}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
              </svg>
              <span className={`rank-text ${rankStyle}`}>{rank}位</span>
            </div>
            
            {/* 店舗画像 */}
            <div className="shop-image-wrapper">
              {shop.imageUrl ? (
                <img
                  src={shop.imageUrl}
                  alt={shop.name}
                  className="shop-image"
                />
              ) : (
                <div className="shop-image-placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* 右側：店舗情報 */}
          <div className="shop-info-premium">
            {/* 店舗名 */}
            <div className="shop-header">
              {shop.url ? (
                <a
                  href={shop.url}
                  onClick={handleNameClick}
                  className="shop-name-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shop.name}
                </a>
              ) : (
                <h3 className="shop-name">{shop.name}</h3>
              )}
              
              {/* 店舗タイプバッジ */}
              <span className="store-type-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                店舗
              </span>
            </div>

            {/* エリア・住所 */}
            <div className="shop-location-premium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{shop.prefectureName}{shop.subAreaName ? ` / ${shop.subAreaName}` : ''}</span>
            </div>

            {/* 電話番号 */}
            {shop.phone && (
              <div className="shop-phone-premium">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{shop.phone}</span>
              </div>
            )}

            {/* 説明文 */}
            {shop.description && (
              <p className="shop-description-premium">{shop.description}</p>
            )}

            {/* 住所 */}
            {shop.address && (
              <div className="shop-address-premium">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{shop.address}</span>
              </div>
            )}

            {/* 公式サイトボタン */}
            <button onClick={handleClick} className="official-site-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              公式サイトを見る
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 無料掲載の場合
  return (
    <div className="shop-card-free">
      <div className="shop-card-free-content">
        <div className="shop-card-free-left">
          <span className="rank-free">{rank}位</span>
          
          {shop.url ? (
            <a
              href={shop.url}
              onClick={handleNameClick}
              className="shop-name-free-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shop.name}
            </a>
          ) : (
            <h3 className="shop-name-free">{shop.name}</h3>
          )}
          
          <span className="store-type-badge-free">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            店舗
          </span>
        </div>
        
        <div className="shop-card-free-right">
          <div className="shop-location-free">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{shop.prefectureName}{shop.subAreaName ? ` / ${shop.subAreaName}` : ''}</span>
          </div>

          {shop.phone && (
            <div className="shop-phone-free">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>{shop.phone}</span>
            </div>
          )}

          <button onClick={handleClick} className="detail-button">
            詳細
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopCard;
