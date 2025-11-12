/**
 * An array of routes that do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification", "/api/test-n8n"];

/**
 * An array of routes that require authentication
 * These routes will redirect logged in users to depending on their role
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @param {string} role - The role of the user
 * @returns {string} - The redirect path
 */
export const DEFAULT_LOGIN_REDIRECT = (role: string): string => {
  if (role === "ADMIN") {
    return "/users";
  } else if (role === "ACCOUNT_HOLDER") {
    return "/home";
  } else if (role === "SIGNATORY") {
    return "/dashboard";
  } else if (role === "UNKNOWN"){
    return "/auth/login";
  } else {
    return "/auth/login";
  }
};
