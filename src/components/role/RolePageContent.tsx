'use client';

import { useState } from 'react';
import RoleModalWrapper from '@/components/role/RoleModalWrapper';
import RoleTable from '@/components/role/RoleTable';
import {
  deleteRole,
  getRoles,
  mapToCreateRoleRequest,
  updateRole,
} from '@/service/roleService';

interface RolePageContentProps {
  initialRoles: RoleDTO[];
  initialPermission: PermissionDTO[];
}

export default function RolePageContent({
  initialRoles,
  initialPermission,
}: RolePageContentProps) {
  const [roles, setRoles] = useState<RoleDTO[]>(initialRoles);

  const fetchRoles = async () => {
    const rolesData = await getRoles();
    setRoles(rolesData.data.data || []);
  };

  const handleDeleteRole = async (id: string) => {
    await deleteRole(id);
    await fetchRoles();
  };

  const handleUpdateRole = async (
    id: string,
    data: { name: string; permissions: string[] }
  ) => {
    await updateRole(id, mapToCreateRoleRequest(data));
    await fetchRoles();
  };

  return (
    <div className="bg-gray-800 px-4 py-4">
      <div className="mb-6 flex items-center justify-end">
        <RoleModalWrapper
          onRoleCreated={fetchRoles}
          permissionsList={initialPermission}
        />
      </div>
      <RoleTable
        roles={roles}
        onDeleteRole={handleDeleteRole}
        onUpdateRole={handleUpdateRole}
        permissions={initialPermission}
      />
    </div>
  );
}
