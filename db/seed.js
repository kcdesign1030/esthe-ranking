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

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function seed() {
  try {
    console.log('Seeding database...');

    // 管理者ユーザーを作成
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client`
      INSERT INTO users (email, password, role)
      VALUES ('admin@example.com', ${hashedPassword}, 'admin')
      ON CONFLICT (email) DO NOTHING
    `;
    console.log('Admin user created: admin@example.com / admin123');

    // サンプル都道府県データ
    const prefectures = ['東京都', '大阪府', '神奈川県', '愛知県', '福岡県'];
    for (const name of prefectures) {
      await client`
        INSERT INTO prefectures (name)
        VALUES (${name})
        ON CONFLICT DO NOTHING
      `;
    }
    console.log('Prefectures created');

    // サンプル小エリアデータ
    const subAreas = [
      { name: '渋谷', prefectureId: 1 },
      { name: '新宿', prefectureId: 1 },
      { name: '梅田', prefectureId: 2 },
      { name: '心斎橋', prefectureId: 2 },
      { name: '横浜', prefectureId: 3 },
    ];

    for (const area of subAreas) {
      await client`
        INSERT INTO sub_areas (name, prefecture_id)
        VALUES (${area.name}, ${area.prefectureId})
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
