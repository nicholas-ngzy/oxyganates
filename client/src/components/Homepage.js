import React from 'react';
import NavMenu from './NavMenu';

const Homepage = () => {
  return (
    <div>
      <NavMenu />
      <div className='catalog-wrapper'>
        <h1>Homepage</h1>
        <h2>Welcome to Homepage which is only visible when you are logged in </h2>
      </div>
    </div>
  );
};
export default Homepage;
