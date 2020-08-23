import React, { useState, useEffect } from 'react';
import { Router, Route, Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { authService } from './services';
import { capitalizeFirstLetter } from './helpers';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import EmployeesPage from './pages/admin/EmployeesPage';
import AddEmployeePage from './pages/admin/AddEmployeePage';
import ReviewsPage from './pages/ReviewsPage';
import AddReviewPage from './pages/admin/AddReviewPage';

import './App.css';

const history = createBrowserHistory();

interface User {
  name: string;
}

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setIsAdmin(user?.role?.name === 'admin');
  }, []);

  const logout = () => {
    authService.logout();
    history.push('/login');
  };

  return (
    <Router history={history}>
      <div>
        {currentUser && (
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
              <p className="App__UserName">
                Hi {capitalizeFirstLetter(currentUser!.name)}
              </p>
              <Link to="/" className="nav-item nav-link">
                Home
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-item nav-link">
                  Employees
                </Link>
              )}
              <Link
                to={`${isAdmin ? '/admin' : ''}/reviews`}
                className="nav-item nav-link"
              >
                Reviews
              </Link>
              <a onClick={logout} className="nav-item nav-link">
                Logout
              </a>
            </div>
          </nav>
        )}
        <div className="jumbotron">
          <div className="container">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <PrivateRoute exact path="/" component={HomePage} />
                <PrivateRoute exact path="/reviews" component={ReviewsPage} />
                <PrivateRoute
                  exact
                  path="/admin"
                  roles={['admin']}
                  component={EmployeesPage}
                />
                <PrivateRoute
                  exact
                  path="/admin/add-employee"
                  roles={['admin']}
                  component={AddEmployeePage}
                />
                <PrivateRoute
                  exact
                  path="/admin/reviews"
                  roles={['admin']}
                  component={ReviewsPage}
                />
                <PrivateRoute
                  exact
                  path="/admin/reviews/new"
                  roles={['admin']}
                  component={AddReviewPage}
                />
                <Route path="/login" component={LoginPage} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
