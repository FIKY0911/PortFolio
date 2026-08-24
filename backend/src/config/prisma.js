import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// adapter-mariadb menolak scheme "mysql://" → parse DATABASE_URL jadi opsi granular
function makeAdapter() {
  const url = new URL(process.env.DATABASE_URL);
  return new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit: 5,
  });
}

export const prisma = new PrismaClient({ adapter: makeAdapter() });
