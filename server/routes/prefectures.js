import express from 'express';
import { db } from '../../db/index.js';
import { prefectures } from '../../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 都道府県一覧取得
router.get('/', async (req, res) => {
  try {
    const result = await db
      .select()
      .from(prefectures)
      .orderBy(asc(prefectures.displayOrder), asc(prefectures.id));

    res.json(result);
  } catch (error) {
    console.error('Get prefectures error:', error);
    res.status(500).json({ error: '都道府県の取得に失敗しました' });
  }
});

// 都道府県詳細取得
router.get('/:id', async (req, res) => {
  try {
    const [prefecture] = await db
      .select()
      .from(prefectures)
      .where(eq(prefectures.id, parseInt(req.params.id)));

    if (!prefecture) {
      return res.status(404).json({ error: '都道府県が見つかりません' });
    }

    res.json(prefecture);
  } catch (error) {
    console.error('Get prefecture error:', error);
    res.status(500).json({ error: '都道府県の取得に失敗しました' });
  }
});

// 都道府県作成（管理者のみ）
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [newPrefecture] = await db.insert(prefectures).values(req.body).returning();
    res.status(201).json(newPrefecture);
  } catch (error) {
    console.error('Create prefecture error:', error);
    res.status(500).json({ error: '都道府県の作成に失敗しました' });
  }
});

// 都道府県更新（管理者のみ）
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [updatedPrefecture] = await db
      .update(prefectures)
      .set(req.body)
      .where(eq(prefectures.id, parseInt(req.params.id)))
      .returning();

    if (!updatedPrefecture) {
      return res.status(404).json({ error: '都道府県が見つかりません' });
    }

    res.json(updatedPrefecture);
  } catch (error) {
    console.error('Update prefecture error:', error);
    res.status(500).json({ error: '都道府県の更新に失敗しました' });
  }
});

// 都道府県削除（管理者のみ）
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.delete(prefectures).where(eq(prefectures.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete prefecture error:', error);
    res.status(500).json({ error: '都道府県の削除に失敗しました' });
  }
});

export default router;
