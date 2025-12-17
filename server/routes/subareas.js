import express from 'express';
import { db } from '../../db/index.js';
import { subAreas, prefectures } from '../../db/schema.js';
import { eq, asc } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 小エリア一覧取得
router.get('/', async (req, res) => {
  try {
    const { prefectureId } = req.query;

    let query = db
      .select({
        id: subAreas.id,
        prefectureId: subAreas.prefectureId,
        prefectureName: prefectures.name,
        name: subAreas.name,
        slug: subAreas.slug,
        displayOrder: subAreas.displayOrder,
        createdAt: subAreas.createdAt,
      })
      .from(subAreas)
      .leftJoin(prefectures, eq(subAreas.prefectureId, prefectures.id));

    if (prefectureId) {
      query = query.where(eq(subAreas.prefectureId, parseInt(prefectureId)));
    }

    const result = await query.orderBy(asc(subAreas.displayOrder), asc(subAreas.id));

    res.json(result);
  } catch (error) {
    console.error('Get sub areas error:', error);
    res.status(500).json({ error: '小エリアの取得に失敗しました' });
  }
});

// 小エリア詳細取得
router.get('/:id', async (req, res) => {
  try {
    const [subArea] = await db
      .select({
        id: subAreas.id,
        prefectureId: subAreas.prefectureId,
        prefectureName: prefectures.name,
        name: subAreas.name,
        slug: subAreas.slug,
        displayOrder: subAreas.displayOrder,
        createdAt: subAreas.createdAt,
      })
      .from(subAreas)
      .leftJoin(prefectures, eq(subAreas.prefectureId, prefectures.id))
      .where(eq(subAreas.id, parseInt(req.params.id)));

    if (!subArea) {
      return res.status(404).json({ error: '小エリアが見つかりません' });
    }

    res.json(subArea);
  } catch (error) {
    console.error('Get sub area error:', error);
    res.status(500).json({ error: '小エリアの取得に失敗しました' });
  }
});

// 小エリア作成（管理者のみ）
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [newSubArea] = await db.insert(subAreas).values(req.body).returning();
    res.status(201).json(newSubArea);
  } catch (error) {
    console.error('Create sub area error:', error);
    res.status(500).json({ error: '小エリアの作成に失敗しました' });
  }
});

// 小エリア更新（管理者のみ）
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [updatedSubArea] = await db
      .update(subAreas)
      .set(req.body)
      .where(eq(subAreas.id, parseInt(req.params.id)))
      .returning();

    if (!updatedSubArea) {
      return res.status(404).json({ error: '小エリアが見つかりません' });
    }

    res.json(updatedSubArea);
  } catch (error) {
    console.error('Update sub area error:', error);
    res.status(500).json({ error: '小エリアの更新に失敗しました' });
  }
});

// 小エリア削除（管理者のみ）
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.delete(subAreas).where(eq(subAreas.id, parseInt(req.params.id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete sub area error:', error);
    res.status(500).json({ error: '小エリアの削除に失敗しました' });
  }
});

export default router;
