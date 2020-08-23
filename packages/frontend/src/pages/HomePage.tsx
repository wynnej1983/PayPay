import React, { useState } from 'react';

import { authService } from '../services';

const HomePage = () => {
  const [currentUser] = useState(authService.getCurrentUser());

  return (
    <div>
      <h1>Home</h1>
      <p>Hi {currentUser.name}!</p>
      <p>
        Role: <strong>{currentUser.role?.name || 'None'}</strong>
      </p>
    </div>
  );
};

export default HomePage;
