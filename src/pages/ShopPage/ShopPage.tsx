import { Link } from 'react-router-dom';

import { Title } from './ShopPage.styled';

const ShopPage = () => {
  return (
    <div>
      <Title>Shop Page</Title>
      <Link to="/">Back</Link>
    </div>
  );
};

export default ShopPage;
