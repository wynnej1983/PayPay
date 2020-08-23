import { authHeader, handleResponse } from '../helpers';

export const getAll = async () => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return await fetch(
    `http://localhost:5000/api/v1/reviews`,
    requestOptions
  ).then(handleResponse);
};

export const getById = async (id: string) => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return await fetch(
    `http://localhost:5000/api/v1/reviews/${id}`,
    requestOptions
  ).then(handleResponse);
};

export const getAssigned = async (reviewerId: string) => {
  const requestOptions = { method: 'GET', headers: authHeader() };
  return await fetch(
    `http://localhost:5000/api/v1/reviews/assigned/${reviewerId}`,
    requestOptions
  ).then(handleResponse);
};

export const create = async (
  title: string,
  content: string,
  revieweeId: string
) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ title, content, revieweeId }),
  };

  return fetch(`http://localhost:5000/api/v1/reviews`, requestOptions)
    .then(handleResponse)
    .then((review) => {
      return review;
    });
};

export const assignReviewer = async (id: string, reviewerId: string) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ reviewerId }),
  };

  return fetch(
    `http://localhost:5000/api/v1/reviews/${id}/reviewers`,
    requestOptions
  )
    .then(handleResponse)
    .then((review) => {
      return review;
    });
};

export const addComment = async (
  id: string,
  reviewerId: string,
  comment: string
) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ body: comment, reviewerId }),
  };

  return fetch(
    `http://localhost:5000/api/v1/reviews/${id}/comments`,
    requestOptions
  )
    .then(handleResponse)
    .then((review) => {
      return review;
    });
};
