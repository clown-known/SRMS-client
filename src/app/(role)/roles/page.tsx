'use client';

import { useEffect, useState } from 'react';
import {
  getRoles,
  getPermission,
  RolesPage as IRolesPage,
} from '@/service/roleService';
import RolePageContent from '@/components/role/RolePageContent';
import Loading from '@/components/Loading';

function RolesPage() {
  const [initialRoles, setInitialRoles] = useState<IRolesPage>({
    data: [],
    meta: {
      page: 0,
      take: 0,
      itemCount: 0,
      pageCount: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  });
  const [initialPermissions, setInitialPermissions] = useState<PermissionDTO[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const rolesData = await getRoles();
        const permissionsData = await getPermission();
        setInitialRoles(rolesData);
        setInitialPermissions(permissionsData.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Role List</h1>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <RolePageContent
          initialRoles={initialRoles}
          initialPermissions={initialPermissions}
        />
      )}
    </div>
  );
}

export default RolesPage;
