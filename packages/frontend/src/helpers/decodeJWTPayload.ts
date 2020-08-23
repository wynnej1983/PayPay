export const decodeJWTPayload = (token: string) => {
  if (token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      // ignore
    }
  }

  return null;
};
