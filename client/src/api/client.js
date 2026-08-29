import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('kaalmo_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// The access token expires after ~15 minutes. Without this, any page left
// open past that gets silent 401s on every call — including ones that
// should never fail from the viewer's perspective, like loading a public
// campaign page. On a 401, try the refresh token once; if that also fails,
// the session is genuinely gone and we clear it so the UI reflects reality.
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isAuthEndpoint = config?.url?.startsWith('/auth/');

    if (response?.status !== 401 || config._retried || isAuthEndpoint) {
      throw error;
    }

    const refreshToken = localStorage.getItem('kaalmo_refresh_token');
    if (!refreshToken) throw error;

    config._retried = true;

    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/auth/refresh`, { refreshToken })
          .finally(() => {
            refreshPromise = null;
          });
      }
      const { data } = await refreshPromise;
      localStorage.setItem('kaalmo_access_token', data.accessToken);
      localStorage.setItem('kaalmo_refresh_token', data.refreshToken);

      config.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(config);
    } catch {
      localStorage.removeItem('kaalmo_access_token');
      localStorage.removeItem('kaalmo_refresh_token');
      localStorage.removeItem('kaalmo_user');
      window.dispatchEvent(new Event('kaalmo:session-expired'));
      throw error;
    }
  }
);

export default api;
