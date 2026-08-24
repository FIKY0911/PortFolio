import path from "node:path";
import express from "express";
import session from "express-session";
import { env } from "./config/env.js";
import { UPLOAD_DIR } from "./config/multer.js";
import routes from "./routes/index.js";
import { flash } from "./middlewares/flash.js";
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// --- hardening dasar ---
app.disable("x-powered-by");
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// --- view engine (EJS) ---
app.set("view engine", "ejs");
app.set("views", path.resolve(import.meta.dirname, "views"));

// --- parsers (body dibatasi) ---
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

// --- session (MemoryStore cukup utk dev; produksi → Redis/store permanen) ---
app.use(
  session({
    secret: env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    },
  })
);

app.use(flash);

// --- static uploads ---
// SVG dipaksa unduh (Content-Disposition: attachment) agar script inline-nya
// tidak pernah dieksekusi same-origin → mitigaasi stored XSS via upload SVG.
app.use(
  "/uploads",
  express.static(UPLOAD_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.toLowerCase().endsWith(".svg"))
        res.setHeader("Content-Disposition", "attachment");
    },
  })
);

// --- routes ---
app.use(routes);

// --- 404 & error terpusat (urutan wajib paling akhir) ---
app.use(notFound);
app.use(errorHandler);

export default app;
