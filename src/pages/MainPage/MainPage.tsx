import { Link } from 'react-router-dom';

export default function MainPage() {
  return (
    <div>
      <h1>MainPage</h1>
      <Link to="/product">Product</Link>
    </div>
  );
}
