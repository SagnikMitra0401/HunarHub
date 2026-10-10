-- HunarHub - Supabase / PostgreSQL table creation
-- Run this in the Supabase SQL editor if you are not using `prisma migrate`.
-- Mirrors prisma/schema.prisma exactly. Uses gen_random_uuid() (pgcrypto,
-- enabled by default on Supabase).

create extension if not exists pgcrypto;

create type "Role" as enum ('CUSTOMER', 'ENTREPRENEUR', 'ADMIN');
create type "RequestStatus" as enum ('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED');
create type "OrderStatus" as enum ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

create table "User" (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  email          text not null unique,
  "passwordHash" text not null,
  role           "Role" not null default 'CUSTOMER',
  phone          text,
  location       text,
  "createdAt"    timestamptz not null default now()
);

create table "Category" (
  id   uuid primary key default gen_random_uuid(),
  name text not null unique
);

create table "Entrepreneur" (
  id            uuid primary key default gen_random_uuid(),
  "userId"      uuid not null unique references "User"(id) on delete cascade,
  "categoryId"  uuid not null references "Category"(id),
  bio           text,
  location      text,
  "priceRange"  text,
  "isVerified"  boolean not null default false,
  "isAvailable" boolean not null default true,
  "createdAt"   timestamptz not null default now()
);

create table "Product" (
  id               uuid primary key default gen_random_uuid(),
  "entrepreneurId" uuid not null references "Entrepreneur"(id) on delete cascade,
  name             text not null,
  description      text,
  price            numeric(10,2) not null,
  "imageUrl"       text,
  "createdAt"      timestamptz not null default now()
);

create table "ServiceRequest" (
  id               uuid primary key default gen_random_uuid(),
  "customerId"     uuid not null references "User"(id),
  "entrepreneurId" uuid not null references "Entrepreneur"(id),
  description      text not null,
  status           "RequestStatus" not null default 'PENDING',
  "createdAt"      timestamptz not null default now()
);

create table "Order" (
  id           uuid primary key default gen_random_uuid(),
  "customerId" uuid not null references "User"(id),
  "productId"  uuid not null references "Product"(id),
  quantity     integer not null default 1,
  "totalPrice" numeric(10,2) not null,
  status       "OrderStatus" not null default 'PENDING',
  "createdAt"  timestamptz not null default now()
);

create table "Review" (
  id                 uuid primary key default gen_random_uuid(),
  "customerId"       uuid not null references "User"(id),
  "entrepreneurId"   uuid not null references "Entrepreneur"(id),
  "orderId"          uuid unique references "Order"(id),
  "serviceRequestId" uuid unique references "ServiceRequest"(id),
  rating             integer not null check (rating between 1 and 5),
  comment            text,
  "createdAt"        timestamptz not null default now()
);

-- Seed the fixed category list used throughout the app
insert into "Category" (name) values
  ('Cobbler'),
  ('Potter (Kumhar)'),
  ('Tailor'),
  ('Artisan'),
  ('Small Vendor');

-- Helpful indexes for filtering/search (Section 5.1: filter by skill, location, price)
create index idx_entrepreneur_category on "Entrepreneur"("categoryId");
create index idx_entrepreneur_location on "Entrepreneur"(location);
create index idx_product_entrepreneur on "Product"("entrepreneurId");
create index idx_servicerequest_entrepreneur on "ServiceRequest"("entrepreneurId");
create index idx_servicerequest_customer on "ServiceRequest"("customerId");
create index idx_order_customer on "Order"("customerId");
create index idx_order_product on "Order"("productId");
