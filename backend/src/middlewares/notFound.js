/** 404: JSON untuk /api/*, halaman EJS untuk sisanya */
export function notFound(req, res) {
  if (req.path.startsWith("/api"))
    return res.status(404).json({ success: false, message: "Endpoint tidak ditemukan." });
  res.status(404).render("pages/errors/404.ejs");
}
