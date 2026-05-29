import { appApi } from './config';

export const postApiServices = (path, value = {}) => {
  return appApi.post(`${path}`, value);
};

export const updateApiServices = (path, id, value) => {
  return appApi.put(`${path}/${id}`, value);
};

export const putApiServices = (path, value) => {
  return appApi.put(`${path}`, value);
};

export const getApiServices = (path) => {
  return appApi.get(path);
};
