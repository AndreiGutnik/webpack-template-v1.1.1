import { Link } from 'react-router-dom';

import classes from './App.module.scss';

export const App = () => {
  return (
    <div data-testid={'App.DataTestId'}>
      <Link to={'/shop'}>shop</Link>
    </div>
  );
};
