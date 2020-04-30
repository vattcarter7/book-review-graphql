import React from 'react';
import * as R from 'ramda';
import { NavLink } from 'react-router-dom';

const className =
  'f6 f5-l link bg-animate black-80 hover-bg-black-10 dib pa3 ph4-l outline-transparent';

const links = [
  { name: 'Home', to: '/' },
  { name: 'Add Book', to: '/add' }
];

const navLink = R.curry((className, links) => {
  const { name, to } = links;
  return (
    <NavLink
      to={to}
      key={to}
      exact
      activeClassName='fw6 underline'
      className={className}
    >
      {name}
    </NavLink>
  );
});

const Nav = () => {
  return (
    <nav className='bt bb center mt3'>{R.map(navLink(className), links)}</nav>
  );
};

export default Nav;
