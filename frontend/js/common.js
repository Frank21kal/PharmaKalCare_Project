const API_BASE = window.API_BASE_URL || "http://localhost:5000/api";
const token = () => localStorage.getItem("token");
const currentUser = () => { try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; } };
async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (token()) headers.set("Authorization", `Bearer ${token()}`);
  if (!(options.body instanceof FormData) && options.body) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && token()) { localStorage.removeItem("token"); localStorage.removeItem("user"); }
    throw new Error(data.message || `Request failed (${response.status})`);
  }
  return data;
}
function signOut() { localStorage.removeItem("token"); localStorage.removeItem("user"); location.href = "login.html"; }
function requireAuth(allowed = []) {
  const u = currentUser();
  if (!token() || !u) { location.href = "login.html"; return null; }
  if (allowed.length && !allowed.includes(u.role)) { alert("Your account does not have access to this page."); location.href = "dashboard.html"; return null; }
  document.querySelectorAll("[data-user-name]").forEach(el => el.textContent = u.name);
  document.querySelectorAll("[data-user-role]").forEach(el => el.textContent = u.role);
  document.querySelectorAll("[data-profile-picture]").forEach(el => {
    if (u.profilePicture) { el.textContent = ""; el.style.backgroundImage = `url('${API_BASE.replace(/\/api$/, "")}${u.profilePicture}')`; el.classList.add("has-picture"); }
    else el.textContent = (u.name || "?").trim().charAt(0).toUpperCase();
  });
  document.querySelectorAll("[data-logout]").forEach(el => el.addEventListener("click", signOut));
  return u;
}
function showMessage(node, message, isError = false) { if (!node) return; node.textContent = message; node.className = isError ? "message error" : "message success"; }
// Hide navigation links unless the signed-in role is explicitly listed.
document.querySelectorAll("[data-roles]").forEach(link => {
  const allowed = link.dataset.roles.split(",");
  if (!allowed.includes(currentUser()?.role)) link.hidden = true;
});
