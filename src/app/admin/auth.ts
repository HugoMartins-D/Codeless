/** Gate simples para uso local. Troque a senha abaixo quando quiser. */
const ADMIN_PASSWORD = "codeless2026";
const AUTH_KEY = "codeless_admin_auth";

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}

export function tryAdminLogin(password: string): boolean {
  if (password !== ADMIN_PASSWORD) return false;
  localStorage.setItem(AUTH_KEY, "true");
  return true;
}

export function adminLogout(): void {
  localStorage.removeItem(AUTH_KEY);
}
