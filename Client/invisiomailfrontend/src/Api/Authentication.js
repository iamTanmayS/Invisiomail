import config from "../configs/configenv";

export const loginWithGoogle = async () => {
  window.location.href = `${config.Server.serverUrl}/auth/google/login`;
};

export const logout = async () => {
  try {
    const res = await fetch(`${config.Server.serverUrl}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Logout failed');
    }

    return true;
  } catch (err) {
    console.error('Logout error:', err);
    throw err;
  }
};

export const fetchWithAutoRefresh = async (url, options = {}, retryCount = 1) => {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (res.status === 401 && retryCount > 0) {
      // Try to refresh token
      const refreshRes = await fetch(`${config.Server.serverUrl}/auth/refreshToken`, {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        // Retry original request
        return fetchWithAutoRefresh(url, options, retryCount - 1);
      } else {
        // Refresh failed, user needs to login again
        throw new Error('Session expired');
      }
    }

    return res;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};