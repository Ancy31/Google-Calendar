import axios from 'axios';
import Cookies from 'universal-cookie';
import { ROUTE_PATHS } from '../routes/routes';

export const appApi = axios.create({
  baseURL: 'http://localhost:5173',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

appApi.interceptors.request.use((config) => {
  const tokenLogin = localStorage.getItem('Token');
  const cookies = new Cookies();
  const token = cookies.get('bearerToken');

  const activeToken = token || (tokenLogin ? JSON.parse(tokenLogin) : null);

  if (activeToken) {
    config.headers.Authorization = `Bearer ${activeToken}`;
  }

  return config;
});

appApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
    }
    return Promise.reject(error);
  },
);

export const handleToken = async () => {
  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: '677252180672-mtklniaflulv0i9cvtm92rgp50vmie5e.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar.events',
      callback: (tokenResponse) => {
        if (tokenResponse && tokenResponse.access_token) {
          localStorage.setItem('Token', JSON.stringify(tokenResponse.access_token));
          window.location.href = ROUTE_PATHS.calendar;
        }
      },
    });
    await tokenClient.requestAccessToken();
  } catch (err) {
    console.error('Error initializing token client:', err);
  }
};
