# 🌍 Next.js Master Data Management (MDM)

A high-performance, vendor-neutral Master Data Management application built with **Next.js 16**, **Drizzle ORM**, and **PostgreSQL**.

## 🎯 Project Goals

The goal of this MDM system is to provide a "Single Source of Truth" for member data, ensuring high data quality and system portability.

- **Data Integrity**: Built-in validation to ensure member records match reference data (Countries).
- **Database Portability**: Uses Drizzle ORM to abstract SQL logic, allowing migration between PostgreSQL, MySQL, or Oracle with minimal code changes.
- **Performance**: Optimized Server Actions and Parallel Data Fetching (`Promise.all`) for fast UI response times.

---

## ✨ Key Features

### 🔍 Searchable Reference Data

Uses a lightweight `<datalist>` component to allow users to search through hundreds of countries instantly without the overhead of heavy third-party dropdown libraries.

### ⚡ Parallel Data Fetching

The application fetches Member details and Country lists simultaneously using asynchronous promises to reduce page load time by up to 50%.

### 🔄 Intelligent Upsert Logic

Supports "Merge" operations that automatically decide whether to Insert a new record or Update an existing one based on the unique `Member Code`.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: JavaScript / TypeScript
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL
- **Styling**: Tailwind CSS
- **Notifications**: Sonner (Toast alerts)

---

## 🚀 Quick Start

1.  **Install**: `npm install`
2.  **Configure**: Create `.env.local` with your `DATABASE_URL`.
3.  **Setup DB**: Import `schema_backup.sql` to your local Postgres instance.
4.  **Run**: `npm run dev`

For detailed setup instructions, please refer to [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 🛡 Soft Delete Strategy

This system implements a **Soft Delete** pattern. Records are never permanently removed from the database; instead, they are flagged with a `deleted_at` timestamp to maintain a full audit trail and allow for data recovery.

---

## 📄 License

Internal Corporate Use - All Rights Reserved.
