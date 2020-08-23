import { authHeader, handleResponse } from '../helpers';

export const getAll = async () => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return await fetch(`http://localhost:5000/api/v1/users`, requestOptions).then(
    handleResponse
  );
};

export const getById = async (id: string) => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return await fetch(
    `http://localhost:5000/api/v1/users/${id}`,
    requestOptions
  ).then(handleResponse);
};

export const create = async (name: string, email: string, password: string) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ name, email, password }),
  };

  return fetch(`http://localhost:5000/api/v1/users`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      return user;
    });
};

export const remove = async (id: string) => {
  const requestOptions = { method: 'DELETE', headers: authHeader() };
  return await fetch(
    `http://localhost:5000/api/v1/users/${id}`,
    requestOptions
  ).then(handleResponse);
};
