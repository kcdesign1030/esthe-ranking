import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';
import * as schema from './schema.js';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const client = postgres(connectionString, { ssl: 'require' });
const db = drizzle(client, { schema });

async function seed() {
  try {
    console.log('Seeding database...');

    // 管理者ユーザーを作成
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client`
      INSERT INTO users (email, password_hash, role)
      VALUES ('admin@example.com', ${hashedPassword}, 'admin')
      ON CONFLICT (email) DO NOTHING
    `;
    console.log('Admin user created: admin@example.com / admin123');

    // サンプル都道府県データ
    const prefectures = [
      { name: '東京都', slug: 'tokyo', region: '関東', displayOrder: 1 },
      { name: '大阪府', slug: 'osaka', region: '関西', displayOrder: 2 },
      { name: '神奈川県', slug: 'kanagawa', region: '関東', displayOrder: 3 },
      { name: '愛知県', slug: 'aichi', region: '東海', displayOrder: 4 },
      { name: '福岡県', slug: 'fukuoka', region: '九州', displayOrder: 5 },
    ];
    for (const pref of prefectures) {
      await client`
        INSERT INTO prefectures (name, slug, region, display_order)
        VALUES (${pref.name}, ${pref.slug}, ${pref.region}, ${pref.displayOrder})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log('Prefectures created');

    // サンプル小エリアデータ
    const subAreas = [
      { name: '渋谷', slug: 'tokyo-shibuya', prefectureId: 1, displayOrder: 1 },
      { name: '新宿', slug: 'tokyo-shinjuku', prefectureId: 1, displayOrder: 2 },
      { name: '梅田', slug: 'osaka-umeda', prefectureId: 2, displayOrder: 1 },
      { name: '心斎橋', slug: 'osaka-shinsaibashi', prefectureId: 2, displayOrder: 2 },
      { name: '横浜', slug: 'kanagawa-yokohama', prefectureId: 3, displayOrder: 1 },
    ];

    for (const area of subAreas) {
      await client`
        INSERT INTO sub_areas (name, slug, prefecture_id, display_order)
        VALUES (${area.name}, ${area.slug}, ${area.prefectureId}, ${area.displayOrder})
        ON CONFLICT (slug) DO NOTHING
      `;
    }
    console.log('Sub areas created');

    // サンプル店舗データ
    const shops = [
      {
        name: 'エステサロン渋谷店',
        prefectureId: 1,
        subAreaId: 1,
        address: '東京都渋谷区渋谷1-1-1',
        phone: '03-1234-5678',
        url: 'https://example.com',
        description: '渋谷駅から徒歩3分の好立地。最新の美容機器を完備。',
        isPremium: true,
        serviceType: 'both',
      },
      {
        name: 'ビューティーサロン新宿',
        prefectureId: 1,
        subAreaId: 2,
        address: '東京都新宿区新宿2-2-2',
        phone: '03-2345-6789',
        url: 'https://example.com',
        description: '新宿駅直結で雨の日も安心。経験豊富なスタッフが対応。',
        isPremium: false,
        serviceType: 'store',
      },
    ];

    for (const shop of shops) {
      await client`
        INSERT INTO shops (name, prefecture_id, sub_area_id, address, phone, url, description, is_premium, service_type)
        VALUES (
          ${shop.name},
          ${shop.prefectureId},
          ${shop.subAreaId},
          ${shop.address},
          ${shop.phone},
          ${shop.url},
          ${shop.description},
          ${shop.isPremium},
          ${shop.serviceType}
        )
      `;
    }
    console.log('Sample shops created');

    console.log('Seeding completed successfully!');

    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    await client.end();
    process.exit(1);
  }
}

seed();
