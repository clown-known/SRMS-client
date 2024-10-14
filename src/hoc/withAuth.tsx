import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { NextComponentType } from 'next';
import { RootState } from '@/store/store';
import { fetchUserPermissions } from '@/store/userSlice';

const withAuth = (Component: NextComponentType, requiredPermission: string) => {
  const AuthenticatedComponent = (props: any) => {
    const { isLoggedIn, permissions } = props;
    console.log(isLoggedIn);
    // const dispatch = useDispatch();
    // const router = useRouter();
    // const { isLoggedIn, permissions } = useSelector(
    //   (state: RootState) => state.user
    // );

    // useEffect(() => {
    //   if (!isLoggedIn) {
    //     // User is not authenticated, redirect to login
    //     router.push('/login');
    //   } else if (isLoggedIn && permissions.length === 0) {
    //     // If authenticated, fetch user permissions
    //     dispatch(fetchUserPermissions() as any);
    //   } else if (!permissions.includes(requiredPermission)) {
    //     // If the user doesn't have the required permission, redirect to login
    //     router.push('/login');
    //   }
    // }, [isLoggedIn, permissions, dispatch, router]);

    if (!isLoggedIn || !permissions.includes(requiredPermission)) {
      return null; // Optionally, return a loading spinner here
    }

    return <Component {...props} />;
  };
  if (Component.getInitialProps) {
    AuthenticatedComponent.getInitialProps = Component.getInitialProps;
  }
  return AuthenticatedComponent;
};

export default withAuth;
