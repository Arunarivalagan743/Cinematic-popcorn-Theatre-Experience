// Clear all authentication cookies
export const clearAuthCookies = () => {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

// Check if user needs to re-authenticate
export const handleAuthError = (error, navigate) => {
  if (error.response?.status === 403 || error.response?.status === 401) {
    clearAuthCookies();
    navigate('/sign-in');
    return true;
  }
  return false;
};
