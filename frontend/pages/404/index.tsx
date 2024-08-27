import { GetStaticProps } from 'next';
import { NextPage } from 'next';

const NotFoundPage: NextPage = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};


export default NotFoundPage;
