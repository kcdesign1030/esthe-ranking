# エステサロンランキング

全国のエステサロンをランキング形式で紹介するWebアプリケーション

## 機能

### 公開ページ
- ランキング表示
- 都道府県・小エリアフィルタリング
- キーワード検索
- クリックカウント

### 管理画面
- ダッシュボード（統計表示）
- 店舗管理（追加・編集・削除）
- 都道府県管理
- 小エリア管理

## 技術スタック

### フロントエンド
- React 18
- React Router
- Axios
- Vite

### バックエンド
- Node.js
- Express
- PostgreSQL
- Drizzle ORM
- JWT認証

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定：

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 3. データベースマイグレーション

```bash
npm run migrate
```

### 4. 初期データの登録

```bash
npm run seed
```

デフォルトの管理者アカウント：
- Email: admin@example.com
- Password: admin123

### 5. 開発サーバーの起動

```bash
npm run dev
```

- フロントエンド: http://localhost:5173
- バックエンドAPI: http://localhost:3000

## Vercelデプロイ

### 1. GitHubリポジトリにプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your_github_repo_url
git push -u origin main
```

### 2. Vercelでプロジェクトをインポート

1. Vercelダッシュボードで「Add New Project」
2. GitHubリポジトリを選択
3. 環境変数を設定：
   - `DATABASE_URL`: Neon PostgreSQLの接続文字列
   - `JWT_SECRET`: ランダムな文字列
4. デプロイ

### 3. データベースのセットアップ

デプロイ後、以下のコマンドを実行：

```bash
npm run migrate
npm run seed
```

## ライセンス

MIT
