import { jwtDecode } from "jwt-decode";

// Check if JWT token is expired
export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;

  try {
    const { exp } = jwtDecode(token);
    // Token expiration time is in seconds → convert to ms
    return Date.now() >= exp * 1000;
  } catch (err) {
    console.error("Invalid token:", err);
    return true;
  }
};

// Get stored user from localStorage if token is valid
export const getStoredUser = () => {
  if (isTokenExpired()) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }

  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    console.error("Invalid stored user format:", err);
    return null;
  }
};
