import { lazy } from 'react';

export const calendar = lazy(() => import('../pages/Calendar'));

export const ROUTE_PATHS = {
  calendar: '/',
};
