-- 管理者ユーザーを作成
INSERT INTO users (email, password_hash, role)
VALUES ('admin@example.com', '$2a$10$YourHashedPasswordHere', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 都道府県データ
INSERT INTO prefectures (name, slug, region, display_order)
VALUES 
  ('東京都', 'tokyo', '関東', 1),
  ('大阪府', 'osaka', '関西', 2),
  ('神奈川県', 'kanagawa', '関東', 3),
  ('愛知県', 'aichi', '東海', 4),
  ('福岡県', 'fukuoka', '九州', 5)
ON CONFLICT (slug) DO NOTHING;

-- 小エリアデータ
INSERT INTO sub_areas (name, slug, prefecture_id, display_order)
VALUES 
  ('渋谷', 'tokyo-shibuya', 1, 1),
  ('新宿', 'tokyo-shinjuku', 1, 2),
  ('梅田', 'osaka-umeda', 2, 1),
  ('心斎橋', 'osaka-shinsaibashi', 2, 2),
  ('横浜', 'kanagawa-yokohama', 3, 1)
ON CONFLICT (slug) DO NOTHING;

-- 店舗データ
INSERT INTO shops (name, prefecture_id, sub_area_id, address, phone, url, description, is_premium, service_type)
VALUES 
  ('エステサロン渋谷店', 1, 1, '東京都渋谷区渋谷1-1-1', '03-1234-5678', 'https://example.com', '渋谷駅から徒歩3分の好立地。最新の美容機器を完備。', true, 'both'),
  ('ビューティーサロン新宿', 1, 2, '東京都新宿区新宿2-2-2', '03-2345-6789', 'https://example.com', '新宿駅直結で雨の日も安心。経験豊富なスタッフが対応。', false, 'store'),
  ('リラクゼーションサロン梅田', 2, 3, '大阪府大阪市北区梅田1-1-1', '06-1234-5678', 'https://example.com', '梅田駅から徒歩5分。落ち着いた雰囲気のサロン。', true, 'both');
