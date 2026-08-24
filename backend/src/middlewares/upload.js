import multer from "multer";
import { upload } from "../config/multer.js";
import { HttpError } from "../utils/helpers.js";

/** bungkus multer agar MulterError jadi HttpError(422) berbahasa manusia */
function wrap(mw) {
  return (req, res, next) =>
    mw(req, res, (err) => {
      if (!err) return next();
      if (err instanceof multer.MulterError)
        return next(new HttpError(422, err.code === "LIMIT_FILE_SIZE" ? "Ukuran file maksimal 5 MB." : `Upload gagal: ${err.code}`));
      next(err);
    });
}

/** field multipart tunggal "image" — aman untuk request JSON/urlencoded tanpa file */
export const uploadImage = wrap(upload.single("image"));

/** profile: field "image" + "cv" sekaligus */
export const uploadProfileFiles = wrap(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ])
);
