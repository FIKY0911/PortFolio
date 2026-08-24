# Prisma Client Setup — v7 (WAJIB diikuti backend-dev)

Versi terpasang: `prisma@7.9.1`, `@prisma/client@7.9.1`, `@prisma/adapter-mariadb`.

## Perbedaan kunci v6 → v7

1. **Rust-free client**: generator default adalah `prisma-client` (bukan `prisma-client-js`), output ke folder TS eksplisit (`backend/generated/prisma`), BUKAN ke `node_modules/.prisma`.
2. **Driver adapter WAJIB**: `new PrismaClient()` tanpa opsi GAGAL. MySQL memakai adapter resmi `@prisma/adapter-mariadb`.
3. **`.env` TIDAK dimuat otomatis oleh CLI**: URL datasource dibaca dari `prisma.config.ts` yang melakukan `import "dotenv/config"`.

## Cara benar instantiate (satu-satunya pola)

```js
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts"; // path relatif dari generated/
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

- `PrismaMariaDb` juga menerima opsi granular (`{ host, port, user, password, database, connectionLimit }`) — `connectionString` cukup.
- Singleton: taruh kode ini di `src/config/prisma.js`, ekspor instance `prisma`, jangan buat client baru per-request.

## Import & runtime

- Client hasil generate adalah **TypeScript source** (`client.ts`). Node ≥ 23.6 menjalankannya native via type-stripping (Node 24 di env ini: OK tanpa flag apa pun).
- Import pakai ekstensi eksplisit `.ts`: `import { PrismaClient } from "../generated/prisma/client.ts"`.
- Folder `generated/` di-gitignore; jalankan `npx prisma generate` setelah clone / ubah schema.

## CLI

```bash
npx prisma db push      # sync schema → DB (baca DATABASE_URL via prisma.config.ts)
npx prisma generate     # regenerate client ke backend/generated/prisma
npm run db:seed         # node prisma/seed.js
node prisma/verify.js   # cek counts + sample query
```

## Gotcha

- Jangan import dari `@prisma/client` langsung untuk model types — itu entry lama v6. Pakai `generated/prisma/client.ts`.
- Setelah mengubah `schema.prisma`: `prisma db push` lalu `prisma generate` (db push tidak auto-generate di setup ini).