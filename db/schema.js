import { pgTable, serial, varchar, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core';

// ユーザーテーブル
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 都道府県テーブル
export const prefectures = pgTable('prefectures', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  region: varchar('region', { length: 100 }).notNull(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 小エリアテーブル
export const subAreas = pgTable('sub_areas', {
  id: serial('id').primaryKey(),
  prefectureId: integer('prefecture_id').notNull().references(() => prefectures.id),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// 店舗テーブル
export const shops = pgTable('shops', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  prefectureId: integer('prefecture_id').notNull().references(() => prefectures.id),
  subAreaId: integer('sub_area_id').references(() => subAreas.id),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  url: text('url'),
  description: text('description'),
  imageUrl: text('image_url'),
  isPremium: boolean('is_premium').notNull().default(false),
  serviceType: varchar('service_type', { length: 50 }).notNull().default('both'), // store, dispatch, both
  clickCount: integer('click_count').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// クリックログテーブル
export const clickLogs = pgTable('click_logs', {
  id: serial('id').primaryKey(),
  shopId: integer('shop_id').notNull().references(() => shops.id),
  clickedAt: timestamp('clicked_at').defaultNow(),
});
