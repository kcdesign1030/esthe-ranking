import express from 'express';
import { db } from '../../db/index.js';
import { shops, prefectures, subAreas, clickLogs } from '../../db/schema.js';
import { eq, and, or, like, desc, sql } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 店舗一覧取得（公開）
router.get('/', async (req, res) => {
  try {
    const { prefectureId, subAreaId, keyword, limit = 100 } = req.query;

    let query = db
      .select({
        id: shops.id,
        name: shops.name,
        prefectureId: shops.prefectureId,
        prefectureName: prefectures.name,
        subAreaId: shops.subAreaId,
        subAreaName: subAreas.name,
        address: shops.address,
        phone: shops.phone,
        url: shops.url,
        description: shops.description,
        imageUrl: shops.imageUrl,
        isPremium: shops.isPremium,
        serviceType: shops.serviceType,
        clickCount: shops.clickCount,
      })
      .from(shops)
      .leftJoin(prefectures, eq(shops.prefectureId, prefectures.id))
      .leftJoin(subAreas, eq(shops.subAreaId, subAreas.id))
      .where(eq(shops.isActive, true));

    // フィルタリング
    const conditions = [];
    
    if (prefectureId) {
      conditions.push(eq(shops.prefectureId, parseInt(prefectureId)));
    }
    
    if (subAreaId) {
      conditions.push(eq(shops.subAreaId, parseInt(subAreaId)));
    }
    
    if (keyword) {
      conditions.push(
        or(
          like(shops.name, `%${keyword}%`),
          like(prefectures.name, `%${keyword}%`),
          like(subAreas.name, `%${keyword}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // 有料プランを優先してソート
    const result = await query
      .orderBy(desc(shops.isPremium), desc(shops.clickCount))
      .limit(parseInt(limit));

    res.json(result);
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ error: '店舗の取得に失敗しました' });
  }
});

// 店舗詳細取得
router.get('/:id', async (req, res) => {
  try {
    const [shop] = await db
      .select({
        id: shops.id,
        name: shops.name,
        prefectureId: shops.prefectureId,
        prefectureName: prefectures.name,
        subAreaId: shops.subAreaId,
        subAreaName: subAreas.name,
        address: shops.address,
        phone: shops.phone,
        url: shops.url,
        description: shops.description,
        imageUrl: shops.imageUrl,
        isPremium: shops.isPremium,
        serviceType: shops.serviceType,
        clickCount: shops.clickCount,
      })
      .from(shops)
      .leftJoin(prefectures, eq(shops.prefectureId, prefectures.id))
      .leftJoin(subAreas, eq(shops.subAreaId, subAreas.id))
      .where(eq(shops.id, parseInt(req.params.id)));

    if (!shop) {
      return res.status(404).json({ error: '店舗が見つかりません' });
    }

    res.json(shop);
  } catch (error) {
    console.error('Get shop error:', error);
    res.status(500).json({ error: '店舗の取得に失敗しました' });
  }
});

// クリックカウント
router.post('/:id/click', async (req, res) => {
  try {
    const shopId = parseInt(req.params.id);

    // クリックカウントを増やす
    await db
      .update(shops)
      .set({ clickCount: sql`${shops.clickCount} + 1` })
      .where(eq(shops.id, shopId));

    // クリックログを記録
    await db.insert(clickLogs).values({ shopId });

    res.json({ success: true });
  } catch (error) {
    console.error('Click count error:', error);
    res.status(500).json({ error: 'クリックカウントに失敗しました' });
  }
});

// 店舗作成（管理者のみ）
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [newShop] = await db.insert(shops).values(req.body).returning();
    res.status(201).json(newShop);
  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({ error: '店舗の作成に失敗しました' });
  }
});

// 店舗更新（管理者のみ）
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [updatedShop] = await db
      .update(shops)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(shops.id, parseInt(req.params.id)))
      .returning();

    if (!updatedShop) {
      return res.status(404).json({ error: '店舗が見つかりません' });
    }

    res.json(updatedShop);
  } catch (error) {
    console.error('Update shop error:', error);
    res.status(500).json({ error: '店舗の更新に失敗しました' });
  }
});

// 店舗削除（管理者のみ）
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.delete(shops).where(eq(shops.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete shop error:', error);
    res.status(500).json({ error: '店舗の削除に失敗しました' });
  }
});

// クリックリセット（管理者のみ）
router.post('/:id/reset-clicks', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db
      .update(shops)
      .set({ clickCount: 0 })
      .where(eq(shops.id, parseInt(req.params.id)));

    res.json({ success: true });
  } catch (error) {
    console.error('Reset clicks error:', error);
    res.status(500).json({ error: 'クリックリセットに失敗しました' });
  }
});

export default router;
