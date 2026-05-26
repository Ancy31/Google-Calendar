import { lazy } from 'react';
export const login = lazy(() => import('../pages/Login'));

export const calendar = lazy(() => import('../pages/Calendar'));

export const ROUTE_PATHS = {
  login: '/',
  calendar: '/calendar',
};
