import { calendar, login, ROUTE_PATHS } from './routes';

export const APP_ROUTES = [
  {
    path: ROUTE_PATHS?.calendar,
    element: calendar,
  },
  {
    path: ROUTE_PATHS?.login,
    element: login,
  },
];
