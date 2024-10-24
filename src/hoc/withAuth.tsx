import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextComponentType } from 'next';
import { RootState } from '@/store/store';
import Login from '@/app/(auth)/login/page';
import Loading from '@/components/Loading';
import ForbiddenPage from '@/components/ForbiddenPage';

const withAuth = (Component: NextComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state: RootState) => state.user);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Simulate a delay for loading
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300); // 1 second delay

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }, []);

    if (loading) {
      return <Loading />; // Show loading spinner while checking auth
    }
    if (!isLoggedIn) return <Login />;

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    AuthenticatedComponent.getInitialProps = Component.getInitialProps;
  }

  return AuthenticatedComponent;
};

export default withAuth;
