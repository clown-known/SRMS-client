'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import Pagination from '@mui/material/Pagination';
import { useSelector } from 'react-redux';
import RoleModalWrapper from '@/components/role/RoleModalWrapper';
import RoleTable from '@/components/role/RoleTable';
import {
  RolesPage,
  deleteRole,
  getRoles,
  mapToCreateRoleRequest,
  searchRoles,
  updateRole,
} from '@/service/roleService';
import SearchInput from '../account/SearchInput';
import { RootState, useAppDispatch } from '@/store/store';
import { fetchUserPermissions } from '@/store/userSlice';
import Loading from '../Loading';

interface RolePageContentProps {
  initialRoles: RolesPage;
  initialPermissions: PermissionDTO[];
}

export default function RolePageContent({
  initialRoles,
  initialPermissions,
}: RolePageContentProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const permissions = useSelector((state: RootState) => state.user.permissions);
  const searchParams = useSearchParams();
  const [roles, setRoles] = useState<RolesPage>(initialRoles);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchUserPermissions() as any);
    setIsLoading(false);
  }, [dispatch]);

  const hasPermission = (permissionRequired: string) => {
    if (permissions.length === 0) return false;
    return permissions.includes(permissionRequired);
  };

  const fetchRoles = useCallback(
    async (term: string = '', currentPage: number = 1) => {
      setIsLoading(true);
      try {
        const fetchedRoles = term
          ? await searchRoles(term, currentPage)
          : await getRoles(currentPage);
        console.log(fetchedRoles);
        setRoles(fetchedRoles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateSearchParam = useCallback(
    (term: string, currentPage: number) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      params.set('page', currentPage.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (term: string) => {
      setPage(1);
      updateSearchParam(term, 1);
      fetchRoles(term, 1);
    },
    [updateSearchParam, fetchRoles]
  );

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSearch(searchTerm.trim());
  };

  const handleDeleteRole = async (id: string) => {
    await deleteRole(id);
    fetchRoles(searchTerm, page);
  };

  const handleUpdateRole = async (
    id: string,
    data: { name: string; permissions: string[] }
  ) => {
    await updateRole(id, mapToCreateRoleRequest(data));
    fetchRoles(searchTerm, page);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    updateSearchParam(searchTerm, value);
    fetchRoles(searchTerm, value);
  };

  useEffect(() => {
    const searchTerm = searchParams.get('search') || '';
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    setPage(currentPage);
    fetchRoles(searchTerm, currentPage);
  }, [fetchRoles, searchParams]);

  return (
    <div className="bg-gray-100 px-4 py-4">
      <div className="mb-6 flex items-center justify-between">
        <div className="w-1/3">
          <form onSubmit={handleSearchSubmit}>
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search roles..."
            />
          </form>
        </div>
        {hasPermission('role:create') && (
          <RoleModalWrapper
            onRoleCreated={() => fetchRoles(searchTerm, page)}
            permissionsList={initialPermissions}
          />
        )}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <RoleTable
            roles={roles?.data}
            onDeleteRole={handleDeleteRole}
            onUpdateRole={handleUpdateRole}
            permissions={initialPermissions}
            userPermissions={permissions}
          />
          <div className="mt-4 flex justify-center">
            <Pagination
              count={roles?.meta?.pageCount}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </>
      )}
    </div>
  );
}
