-- ─────────────────────────────────────────────────────────────────
--  Auraè Jewellery — Full Database Schema
--  MySQL 8.0+  |  charset: utf8mb4  |  collation: utf8mb4_unicode_ci
-- ─────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS aurae_jewellery
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE aurae_jewellery;

-- ─────────────────────────────────────────
--  USERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  name            VARCHAR(120)     NOT NULL,
  email           VARCHAR(191)     NOT NULL,
  phone           VARCHAR(20)      DEFAULT NULL,
  password_hash   VARCHAR(255)     NOT NULL,
  role            ENUM('user','admin') NOT NULL DEFAULT 'user',
  avatar          VARCHAR(500)     DEFAULT NULL,
  email_verified  TINYINT(1)       NOT NULL DEFAULT 0,
  is_active       TINYINT(1)       NOT NULL DEFAULT 1,
  last_login_at   DATETIME         DEFAULT NULL,
  created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role),
  KEY idx_users_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  PASSWORD RESETS / OTP
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS password_resets (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  token       VARCHAR(255) NOT NULL,
  otp         VARCHAR(10)  DEFAULT NULL,
  type        ENUM('reset','otp') NOT NULL DEFAULT 'reset',
  expires_at  DATETIME     NOT NULL,
  used_at     DATETIME     DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pr_token (token),
  KEY idx_pr_user_id (user_id),
  CONSTRAINT fk_pr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  ADDRESSES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      INT UNSIGNED NOT NULL,
  label        VARCHAR(50)  DEFAULT 'Home',
  full_name    VARCHAR(120) NOT NULL,
  phone        VARCHAR(20)  NOT NULL,
  line1        VARCHAR(255) NOT NULL,
  line2        VARCHAR(255) DEFAULT NULL,
  city         VARCHAR(100) NOT NULL,
  state        VARCHAR(100) NOT NULL,
  pincode      VARCHAR(10)  NOT NULL,
  country      VARCHAR(60)  NOT NULL DEFAULT 'India',
  is_default   TINYINT(1)   NOT NULL DEFAULT 0,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_addr_user_id (user_id),
  CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  CATEGORIES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(120) NOT NULL,
  description TEXT         DEFAULT NULL,
  image       VARCHAR(500) DEFAULT NULL,
  parent_id   INT UNSIGNED DEFAULT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_category_slug (slug),
  KEY idx_category_parent (parent_id),
  KEY idx_category_active (is_active),
  CONSTRAINT fk_category_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  PRODUCTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id              INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  name            VARCHAR(255)   NOT NULL,
  slug            VARCHAR(280)   NOT NULL,
  sku             VARCHAR(60)    NOT NULL,
  description     TEXT           DEFAULT NULL,
  short_desc      VARCHAR(500)   DEFAULT NULL,
  category_id     INT UNSIGNED   DEFAULT NULL,
  material        VARCHAR(80)    DEFAULT NULL,   -- Gold / Silver / Platinum / Diamond
  purity          VARCHAR(20)    DEFAULT NULL,   -- 18K / 22K / 24K / 925
  weight_gm       DECIMAL(8,3)   DEFAULT NULL,
  price           DECIMAL(12,2)  NOT NULL,
  mrp             DECIMAL(12,2)  DEFAULT NULL,
  stock           INT            NOT NULL DEFAULT 0,
  thumbnail       VARCHAR(500)   DEFAULT NULL,
  images          JSON           DEFAULT NULL,   -- ["url1","url2",...]
  tags            JSON           DEFAULT NULL,   -- ["ring","gold","wedding"]
  occasion        VARCHAR(80)    DEFAULT NULL,
  gender          ENUM('women','men','unisex','kids') DEFAULT 'unisex',
  is_featured     TINYINT(1)     NOT NULL DEFAULT 0,
  is_new_arrival  TINYINT(1)     NOT NULL DEFAULT 0,
  is_bestseller   TINYINT(1)     NOT NULL DEFAULT 0,
  active          TINYINT(1)     NOT NULL DEFAULT 1,
  avg_rating      DECIMAL(3,2)   NOT NULL DEFAULT 0.00,
  review_count    INT            NOT NULL DEFAULT 0,
  sold_count      INT            NOT NULL DEFAULT 0,
  meta_title      VARCHAR(255)   DEFAULT NULL,
  meta_desc       VARCHAR(500)   DEFAULT NULL,
  specs           JSON           DEFAULT NULL,   -- {"stone":"Diamond","cut":"Round"}
  created_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_product_slug (slug),
  UNIQUE KEY uq_product_sku  (sku),
  KEY idx_product_category (category_id),
  KEY idx_product_active   (active),
  KEY idx_product_featured (is_featured),
  KEY idx_product_price    (price),
  KEY idx_product_rating   (avg_rating),
  FULLTEXT KEY ft_product_search (name, description),
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  COUPONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupons (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  code            VARCHAR(30)   NOT NULL,
  type            ENUM('percent','flat') NOT NULL DEFAULT 'percent',
  value           DECIMAL(10,2) NOT NULL,
  min_order_amt   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  max_discount    DECIMAL(12,2) DEFAULT NULL,   -- cap for percent coupons
  max_uses        INT           DEFAULT NULL,
  used_count      INT           NOT NULL DEFAULT 0,
  per_user_limit  INT           NOT NULL DEFAULT 1,
  valid_from      DATETIME      DEFAULT NULL,
  valid_until     DATETIME      DEFAULT NULL,
  is_active       TINYINT(1)    NOT NULL DEFAULT 1,
  description     VARCHAR(255)  DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_coupon_code (code),
  KEY idx_coupon_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  ORDERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id                  INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  order_number        VARCHAR(30)    NOT NULL,
  user_id             INT UNSIGNED   NOT NULL,
  status              ENUM('pending','confirmed','processing','shipped','delivered','cancelled','refunded')
                                     NOT NULL DEFAULT 'pending',
  payment_method      ENUM('razorpay','cod') NOT NULL DEFAULT 'razorpay',
  payment_status      ENUM('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
  razorpay_order_id   VARCHAR(100)   DEFAULT NULL,
  razorpay_payment_id VARCHAR(100)   DEFAULT NULL,
  razorpay_signature  VARCHAR(255)   DEFAULT NULL,
  subtotal            DECIMAL(12,2)  NOT NULL,
  discount_amount     DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
  gst_amount          DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
  shipping_amount     DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
  total               DECIMAL(12,2)  NOT NULL,
  coupon_id           INT UNSIGNED   DEFAULT NULL,
  coupon_code         VARCHAR(30)    DEFAULT NULL,
  -- Shipping snapshot (denormalised so order history is stable)
  shipping_name       VARCHAR(120)   NOT NULL,
  shipping_phone      VARCHAR(20)    NOT NULL,
  shipping_line1      VARCHAR(255)   NOT NULL,
  shipping_line2      VARCHAR(255)   DEFAULT NULL,
  shipping_city       VARCHAR(100)   NOT NULL,
  shipping_state      VARCHAR(100)   NOT NULL,
  shipping_pincode    VARCHAR(10)    NOT NULL,
  shipping_country    VARCHAR(60)    NOT NULL DEFAULT 'India',
  notes               TEXT           DEFAULT NULL,
  tracking_number     VARCHAR(100)   DEFAULT NULL,
  shipped_at          DATETIME       DEFAULT NULL,
  delivered_at        DATETIME       DEFAULT NULL,
  created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_order_number (order_number),
  KEY idx_order_user_id    (user_id),
  KEY idx_order_status     (status),
  KEY idx_order_created_at (created_at),
  CONSTRAINT fk_order_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE RESTRICT,
  CONSTRAINT fk_order_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  ORDER ITEMS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  order_id    INT UNSIGNED  NOT NULL,
  product_id  INT UNSIGNED  DEFAULT NULL,
  product_name VARCHAR(255) NOT NULL,
  sku         VARCHAR(60)   NOT NULL,
  thumbnail   VARCHAR(500)  DEFAULT NULL,
  price       DECIMAL(12,2) NOT NULL,
  qty         INT           NOT NULL DEFAULT 1,
  total       DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_oi_order_id   (order_id),
  KEY idx_oi_product_id (product_id),
  CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  REVIEWS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id  INT UNSIGNED NOT NULL,
  user_id     INT UNSIGNED NOT NULL,
  order_id    INT UNSIGNED DEFAULT NULL,
  rating      TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(160) DEFAULT NULL,
  body        TEXT         DEFAULT NULL,
  images      JSON         DEFAULT NULL,
  is_approved TINYINT(1)   NOT NULL DEFAULT 0,
  is_verified TINYINT(1)   NOT NULL DEFAULT 0,   -- verified purchase
  helpful     INT          NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_review_user_product (user_id, product_id),
  KEY idx_review_product   (product_id),
  KEY idx_review_approved  (is_approved),
  CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_review_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  WISHLISTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wishlists (
  user_id    INT UNSIGNED NOT NULL,
  product_id INT UNSIGNED NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT fk_wish_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  CONSTRAINT fk_wish_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  BLOGS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blogs (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255) NOT NULL,
  slug        VARCHAR(280) NOT NULL,
  excerpt     VARCHAR(500) DEFAULT NULL,
  content     LONGTEXT     NOT NULL,
  cover_image VARCHAR(500) DEFAULT NULL,
  author_id   INT UNSIGNED DEFAULT NULL,
  tags        JSON         DEFAULT NULL,
  category    VARCHAR(80)  DEFAULT NULL,
  is_published TINYINT(1)  NOT NULL DEFAULT 0,
  view_count  INT          NOT NULL DEFAULT 0,
  read_time   INT          DEFAULT NULL,   -- minutes
  meta_title  VARCHAR(255) DEFAULT NULL,
  meta_desc   VARCHAR(500) DEFAULT NULL,
  published_at DATETIME    DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_slug (slug),
  KEY idx_blog_published  (is_published),
  KEY idx_blog_author     (author_id),
  CONSTRAINT fk_blog_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  BANNERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS banners (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255) NOT NULL,
  subtitle    VARCHAR(255) DEFAULT NULL,
  image       VARCHAR(500) NOT NULL,
  mobile_image VARCHAR(500) DEFAULT NULL,
  cta_text    VARCHAR(80)  DEFAULT NULL,
  cta_link    VARCHAR(500) DEFAULT NULL,
  position    VARCHAR(30)  NOT NULL DEFAULT 'hero',  -- hero | mid | bottom
  sort_order  INT          NOT NULL DEFAULT 0,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  valid_from  DATETIME     DEFAULT NULL,
  valid_until DATETIME     DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_banner_position (position),
  KEY idx_banner_active   (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  NOTIFICATIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  type        VARCHAR(60)  NOT NULL,   -- order_update | review_approved | promo
  title       VARCHAR(160) NOT NULL,
  body        TEXT         DEFAULT NULL,
  link        VARCHAR(500) DEFAULT NULL,
  is_read     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notif_user_id (user_id),
  KEY idx_notif_is_read (is_read),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────
--  COUPON USAGE (per-user tracking)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS coupon_usage (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  coupon_id   INT UNSIGNED NOT NULL,
  user_id     INT UNSIGNED NOT NULL,
  order_id    INT UNSIGNED DEFAULT NULL,
  used_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cu_coupon (coupon_id),
  KEY idx_cu_user   (user_id),
  CONSTRAINT fk_cu_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  CONSTRAINT fk_cu_user   FOREIGN KEY (user_id)   REFERENCES users(id)   ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
