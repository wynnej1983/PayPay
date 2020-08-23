import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { authService } from '../services';

const PrivateRoute = ({ component: Component, roles, ...rest }: any) => (
  <Route
    {...rest}
    render={(props: any) => {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        // not logged in so redirect to login page with the return url
        return (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        );
      }

      // check if route is restricted by role
      if (roles && !roles.includes(currentUser?.role?.name)) {
        // role not authorised so redirect to home page
        return <Redirect to={{ pathname: '/' }} />;
      }

      // authorised so return component
      return <Component {...props} />;
    }}
  />
);

export default PrivateRoute;
