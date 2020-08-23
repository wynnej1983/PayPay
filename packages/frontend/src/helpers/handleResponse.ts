import { authService } from '../services';

export const handleResponse = (response: any) => {
  return response.text().then((text: string) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if ([401, 403].indexOf(response.statusCode) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        authService.logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
};

export default handleResponse;
