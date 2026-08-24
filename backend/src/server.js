import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

const server = app.listen(env.port, () => {
  console.log(`🚀 Portfolio backend ready at http://localhost:${env.port}`);
});

// shutdown bersih: tutup server + koneksi DB
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () =>
    server.close(() => prisma.$disconnect().then(() => process.exit(0)))
  );
}
