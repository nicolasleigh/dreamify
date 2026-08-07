-- CreateTable
CREATE TABLE "GeneratedImages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TEXT NOT NULL DEFAULT '',
    "nickname" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT '',
    "signin_type" TEXT NOT NULL DEFAULT '',
    "signin_ip" TEXT NOT NULL DEFAULT '',
    "signin_provider" TEXT NOT NULL DEFAULT '',
    "signin_openid" TEXT NOT NULL DEFAULT '',
    "invite_code" TEXT NOT NULL DEFAULT '',
    "updated_at" TEXT NOT NULL DEFAULT '',
    "invited_by" TEXT NOT NULL DEFAULT '',
    "is_affiliate" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "order_no" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "interval" TEXT NOT NULL,
    "expired_at" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "stripe_session_id" TEXT NOT NULL DEFAULT '',
    "credits" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "sub_id" TEXT NOT NULL DEFAULT '',
    "sub_interval_count" INTEGER NOT NULL DEFAULT 0,
    "sub_cycle_anchor" INTEGER NOT NULL DEFAULT 0,
    "sub_period_end" INTEGER NOT NULL DEFAULT 0,
    "sub_period_start" INTEGER NOT NULL DEFAULT 0,
    "sub_times" INTEGER NOT NULL DEFAULT 0,
    "product_id" TEXT NOT NULL DEFAULT '',
    "product_name" TEXT NOT NULL DEFAULT '',
    "valid_months" INTEGER NOT NULL DEFAULT 0,
    "order_detail" TEXT NOT NULL DEFAULT '',
    "paid_at" TEXT NOT NULL DEFAULT '',
    "paid_email" TEXT NOT NULL DEFAULT '',
    "paid_detail" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "credits" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trans_no" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "trans_type" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "order_no" TEXT NOT NULL,
    "expired_at" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "apikeys" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "api_key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "affiliates" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_uuid" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "invited_by" TEXT NOT NULL,
    "paid_order_no" TEXT NOT NULL DEFAULT '',
    "paid_amount" INTEGER NOT NULL DEFAULT 0,
    "reward_percent" INTEGER NOT NULL DEFAULT 0,
    "reward_amount" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "user_uuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "posts" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT '',
    "title" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "content" TEXT NOT NULL DEFAULT '',
    "created_at" TEXT NOT NULL DEFAULT '',
    "updated_at" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT '',
    "cover_url" TEXT NOT NULL DEFAULT '',
    "author_name" TEXT NOT NULL DEFAULT '',
    "author_avatar_url" TEXT NOT NULL DEFAULT '',
    "locale" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneratedImages_imageUrl_key" ON "GeneratedImages"("imageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "users_uuid_key" ON "users"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_no_key" ON "orders"("order_no");

-- CreateIndex
CREATE UNIQUE INDEX "credits_trans_no_key" ON "credits"("trans_no");

-- CreateIndex
CREATE UNIQUE INDEX "apikeys_api_key_key" ON "apikeys"("api_key");

-- CreateIndex
CREATE UNIQUE INDEX "posts_uuid_key" ON "posts"("uuid");
