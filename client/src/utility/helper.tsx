import cookie from "js-cookie";

interface User {
    firstName: string;
    lastName: string;
  }

// Get from LocalStorage
export const getLocalStorage = (key: string): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
};

// Set in LocalStorage
export const setLocalStorage = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

// Remove from LocalStorage
export const removeLocalStorage = (key: string): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};

// Set Cookie
export const setCookie = (key: string, value: string, expiresDays: number = 1): void => {
  if (typeof window !== "undefined") {
    cookie.set(key, value, {
      expires: expiresDays, // Set the number of days until the cookie expires
    });
  }
};

// Remove Cookie
export const removeCookie = (key: string): void => {
  if (typeof window !== "undefined") {
    cookie.remove(key);
  }
};

// Get Cookie
export const getCookie = (key: string): string | undefined => {
  if (typeof window !== "undefined") {
    return cookie.get(key);
  }
  return undefined;
};

// Check if the user is authenticated
export const isAuth = (): boolean => {
  if (typeof window !== "undefined") {
    const token = getLocalStorage("token");
    return !!token; // Return true if token exists, otherwise false
  }
  return false; // Return false if window is undefined (e.g., in server-side environments)
};

export const currentUserData = (): User | false => {
    if (typeof window !== "undefined") {
      const userData = getLocalStorage("user");
      return userData ? JSON.parse(userData) as User : false;
    }
    return false;
  };

// Store token and user data in LocalStorage
export const authenticate = (response: { data: { token: string } }): void => {
  const { token } = response.data;
  setCookie('token', token);
  setLocalStorage('token', token); 
  // Set expiration date for the session (10 days by default)
  const expirationDate = new Date(new Date().getTime() + 60 * 60 * 24 * 10 * 1000);
  setLocalStorage("expirationDate", expirationDate.toDateString());
};

export const logout = (): void => {
  removeCookie('token'); // Remove token cookie
  removeLocalStorage('token'); // Remove token from localStorage
  removeLocalStorage('user'); // Optionally remove user data
  removeLocalStorage('expirationDate'); // Optionally remove expiration date

  // Optionally, you can also redirect the user to the login page or home page
  window.location.href = '/authenticate/login'; // Redirect to login page
};
