import express from 'express';
import { db } from '../../db/index.js';
import { shops, clickLogs, prefectures, subAreas } from '../../db/schema.js';
import { sql, gte } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ダッシュボード統計（管理者のみ）
router.get('/dashboard', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // 総店舗数
    const [{ totalShops }] = await db
      .select({ totalShops: sql`count(*)::int` })
      .from(shops);

    // 有料プラン店舗数
    const [{ premiumShops }] = await db
      .select({ premiumShops: sql`count(*)::int` })
      .from(shops)
      .where(sql`${shops.isPremium} = true`);

    // 総クリック数
    const [{ totalClicks }] = await db
      .select({ totalClicks: sql`sum(${shops.clickCount})::int` })
      .from(shops);

    // 今日のクリック数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const [{ todayClicks }] = await db
      .select({ todayClicks: sql`count(*)::int` })
      .from(clickLogs)
      .where(gte(clickLogs.clickedAt, today));

    // 都道府県数
    const [{ totalPrefectures }] = await db
      .select({ totalPrefectures: sql`count(*)::int` })
      .from(prefectures);

    // 小エリア数
    const [{ totalSubAreas }] = await db
      .select({ totalSubAreas: sql`count(*)::int` })
      .from(subAreas);

    res.json({
      totalShops: totalShops || 0,
      premiumShops: premiumShops || 0,
      totalClicks: totalClicks || 0,
      todayClicks: todayClicks || 0,
      totalPrefectures: totalPrefectures || 0,
      totalSubAreas: totalSubAreas || 0,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: '統計の取得に失敗しました' });
  }
});

// クリックログ（管理者のみ）
router.get('/clicks', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const result = await db
      .select({
        id: clickLogs.id,
        shopId: clickLogs.shopId,
        shopName: shops.name,
        clickedAt: clickLogs.clickedAt,
      })
      .from(clickLogs)
      .leftJoin(shops, sql`${clickLogs.shopId} = ${shops.id}`)
      .orderBy(sql`${clickLogs.clickedAt} DESC`)
      .limit(parseInt(limit));

    res.json(result);
  } catch (error) {
    console.error('Get click logs error:', error);
    res.status(500).json({ error: 'クリックログの取得に失敗しました' });
  }
});

export default router;
