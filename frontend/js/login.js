const card = document.getElementById("authCard");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const setupForm = document.getElementById("setupForm");
const setupDialog = document.getElementById("setupDialog");
const loginMessage = document.getElementById("message");
const registerMessage = document.getElementById("registerMessage");
const setupMessage = document.getElementById("setupMessage");

function setMode(mode) {
  const registering = mode === "register";
  card.classList.toggle("right-panel-active", registering);
  showMessage(loginMessage, "");
  showMessage(registerMessage, "");
  if (registering) document.getElementById("registerName").focus();
  else document.getElementById("email").focus();
}
document.getElementById("showRegister").addEventListener("click", () => setMode("register"));
document.getElementById("showSignin").addEventListener("click", () => setMode("signin"));
document.getElementById("openSetup").addEventListener("click", () => { showMessage(setupMessage, ""); setupDialog.showModal(); });
document.getElementById("closeSetup").addEventListener("click", () => setupDialog.close());
setupDialog.addEventListener("click", event => { if (event.target === setupDialog) setupDialog.close(); });

loginForm.addEventListener("submit", async event => {
  event.preventDefault();
  const button = loginForm.querySelector("button[type=submit]"); button.disabled = true;
  try {
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email: document.getElementById("email").value.trim(), password: document.getElementById("password").value }) });
    localStorage.setItem("token", data.token); localStorage.setItem("user", JSON.stringify(data.user)); location.href = "dashboard.html";
  } catch (error) { showMessage(loginMessage, error.message, true); }
  finally { button.disabled = false; }
});

registerForm.addEventListener("submit", async event => {
  event.preventDefault();
  const button = registerForm.querySelector("button[type=submit]"); button.disabled = true;
  const data = Object.fromEntries(new FormData(registerForm));
  try {
    await api("/auth/register", { method: "POST", body: JSON.stringify(data) });
    document.getElementById("email").value = data.email;
    registerForm.reset(); setMode("signin");
    showMessage(loginMessage, "Account created. Sign in with your new email and password.");
  } catch (error) { showMessage(registerMessage, error.message, true); }
  finally { button.disabled = false; }
});

setupForm.addEventListener("submit", async event => {
  event.preventDefault();
  const button = setupForm.querySelector("button[type=submit]"); button.disabled = true;
  const data = Object.fromEntries(new FormData(setupForm));
  try {
    await api("/auth/setup-admin", { method: "POST", body: JSON.stringify(data) });
    setupForm.reset(); setupDialog.close(); setMode("signin");
    showMessage(loginMessage, "Administrator created. Remove INITIAL_ADMIN_KEY from backend/.env, restart the server, then sign in.");
  } catch (error) { showMessage(setupMessage, error.message, true); }
  finally { button.disabled = false; }
});
