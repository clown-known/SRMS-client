import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextComponentType } from 'next';
import { useRouter } from 'next/navigation';
import { RootState } from '@/store/store';
import Loading from '@/components/Loading';
import ForbiddenPage from '@/components/ForbiddenPage';

const withoutAuth = (Component: NextComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state: RootState) => state.user);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
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
    if (isLoggedIn) {
      router.push('/');
    }

    return <Component {...props} />;
  };

  if (Component.getInitialProps) {
    AuthenticatedComponent.getInitialProps = Component.getInitialProps;
  }

  return AuthenticatedComponent;
};

export default withoutAuth;
