import handleResponse from '../helpers/handleResponse';

export const getCurrentUser = () => {
  const currentUserJson = localStorage.getItem('currentUser');
  return currentUserJson && JSON.parse(currentUserJson);
};

export const login = async (email: string, password: string) => {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  };

  return fetch(`http://localhost:5000/api/v1/auth/login`, requestOptions)
    .then(handleResponse)
    .then((user) => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(user));

      return user;
    });
};

export const logout = () => {
  // remove user from local storage to log user out
  localStorage.removeItem('currentUser');
};
