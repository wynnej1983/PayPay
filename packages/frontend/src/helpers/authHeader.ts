import { authService } from '../services';

export const authHeader = () => {
  // return authorization header with jwt token
  const currentUser = authService.getCurrentUser();
  if (currentUser && currentUser.token) {
    return { Authorization: `Bearer ${currentUser.token}` };
  } else {
    return undefined;
  }
};
