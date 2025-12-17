import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import shopsRoutes from './routes/shops.js';
import prefecturesRoutes from './routes/prefectures.js';
import subAreasRoutes from './routes/subareas.js';
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア
app.use(cors());
app.use(express.json());

// ルート
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/prefectures', prefecturesRoutes);
app.use('/api/subareas', subAreasRoutes);
app.use('/api/stats', statsRoutes);

// ヘルスチェック
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'サーバーエラーが発生しました' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
