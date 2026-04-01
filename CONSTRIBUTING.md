Here is the complete **raw Markdown** for your `CONTRIBUTING.md` file. You can copy the entire block below and paste it directly into a new file named `CONTRIBUTING.md` in your project's root folder.

````markdown
# 🛠 Contributing to My Next MDM

Welcome to the Master Data Management (MDM) project! This document provides the necessary steps to get your local development environment synchronized and running.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v20.x or higher
- **PostgreSQL**: v14.x or higher
- **npm**: v10.x or higher

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd my-next-mdm
```
````

### 2. Install Dependencies

This project uses **Next.js 16**, **React 19**, and **Drizzle ORM**. Run the following to install all required packages:

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory. This file is ignored by Git for security. Copy and update the following variables:

```env
# Database Connection (Drizzle ORM)
DATABASE_URL=postgres://postgres:Welcome1@localhost:5432/postgres

# Database Connection (Standard Pool)
DB_USER=postgres
DB_HOST=localhost
DB_PASSWORD=Welcome1
DB_NAME=postgres
DB_PORT=5432

# Authentication
AUTH_SECRET=generate_a_random_string_here
```

### 4. Database Schema Synchronization

To ensure your local database matches the application schema, you can use the provided SQL export:

```bash
psql -U postgres -d postgres -f schema_backup.sql
```

Metadata backup
(1) App function and menu group

```bash
pg_dump -U postgres -t menu_group -t menu_items -t app_functions --data-only mdm_db > mdm_metadata_seed.sql
```

(2) App function and menu table

```bash
pg_dump -U postgres -s -t menu_group -t menu_items -t app_functions mdm_db > mdm_metadata_schema.sql
```

Alternatively, if you are making changes to the TypeScript schema, use Drizzle Kit to push updates:

```bash
npx drizzle-kit push
```

---

## 📂 Project Structure

- **`/src/app`**: Next.js App Router pages (Server Components).
- **`/src/lib`**: Server Actions and database query logic.
- **`/src/db`**: Drizzle schema definitions and connection setup.
- **`/src/components`**: Reusable UI components (Form inputs, Sonner toasts).

---

## 💻 Development Commands

| Command                  | Description                                       |
| :----------------------- | :------------------------------------------------ |
| `npm run dev`            | Starts the development server at `localhost:3000` |
| `npm run build`          | Validates types and creates a production build    |
| `npm run lint`           | Runs ESLint to check for code quality issues      |
| `npx drizzle-kit studio` | Opens a GUI to browse your local database         |

---

## ✅ Best Practices

1. **Security**: Never commit `.env` files.
2. **Data Integrity**: Use the `datalist` component for Reference Data (Countries) to ensure `country_id` matches the database.
3. **Portability**: Write queries using **Drizzle ORM** syntax rather than raw SQL strings whenever possible to maintain database vendor independence.

---

## 📬 Questions?

If you run into "NaN" errors or connection issues, please check the `.env.local` formatting or contact the lead developer.

```



### How to use this:
1. **Create** the file: `touch CONTRIBUTING.md`
2. **Paste** the code above.
3. **Commit** it: `git add CONTRIBUTING.md && git commit -m "docs: create contribution guide"`.
4. **Push**: `git push origin main`.

**Would you like me to help you generate a similar "Raw Markdown" for a `README.md` that explains the actual business features of your MDM app?**
```
