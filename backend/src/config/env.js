import "dotenv/config";

const int = (v, d) => (Number.isInteger(Number(v)) && Number(v) > 0 ? Number(v) : d);

export const env = {
  port: int(process.env.PORT, 3001),
  sessionSecret: process.env.SESSION_SECRET || "dev-only-secret-ganti-di-produksi",
  /** false → mutasi (POST/PUT/PATCH/DELETE) /api/v1 ditolak 403; tulis hanya lewat /admin */
  apiWritePublic: process.env.API_WRITE_PUBLIC !== "false",
};
