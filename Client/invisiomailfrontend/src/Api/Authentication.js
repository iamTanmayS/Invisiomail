import config from "../configs/configenv"

export const loginWithGoogle = () => {
    window.location.href = `${config.Server.serverUrl}/auth/google/login`;
  };

  export const logout = async () => {
    try {
      const res = await fetch(`${config.Server.serverUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (res.ok || res.status === 204) {
        window.location.href = '/login';
      } else {
        console.error('Logout failed:', res.status);
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const fetchWithAuth = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  
    return res;
  };


  export const fetchWithAutoRefresh = async (url, options = {}, retryCount = 2) => {
    let res = await fetchWithAuth(url, options);
  
    if (res.status === 401 && retryCount > 0) {
      const refreshRes = await fetch(`${config.Server.serverUrl}/auth/refreshToken`, {
        method: 'POST',
        credentials: 'include',
      });
  
      if (refreshRes.ok) {
        return fetchWithAutoRefresh(url, options, retryCount - 1);
      } else {
        await logout();
        throw new Error('Session expired');
      }
    }
  
    if (!res.ok) {
      throw new Error('Network error');
    }
  
    return res.json();
  };
  
  

