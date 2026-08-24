import bcrypt from "bcryptjs";
import { adminUserModel } from "../../models/adminUser.model.js";
import { asStr } from "../../utils/helpers.js";

export function loginPage(_req, res) {
  res.render("layouts/auth.layout.ejs", { body: "../pages/auth/login.ejs", title: "Login" });
}

export async function login(req, res) {
  const username = asStr(req.body.username);
  const password = asStr(req.body.password);

  const user = username && (await adminUserModel.findByUsername(username));
  // compare tetap dijalankan vs dummy hash agar timing konsisten
  const ok = user && (await bcrypt.compare(password, user.passwordHash || "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinva"));

  if (!ok) {
    req.flash("error", "Username atau password salah.");
    return res.redirect("/admin/login");
  }

  // regenerasi session mencegah fixation
  req.session.regenerate(() => {
    req.session.adminId = user.id;
    req.session.adminUsername = user.username;
    res.redirect("/admin/dashboard");
  });
}

export function logout(req, res) {
  req.session.destroy(() => res.redirect("/admin/login"));
}
