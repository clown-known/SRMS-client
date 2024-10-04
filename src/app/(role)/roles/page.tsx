import RolePageContent from '@/components/role/RolePageContent';
import { getPermission, getRoles } from '@/service/roleService';

async function RolesPage() {
  const rolesData = await getRoles();
  const initialRoles = rolesData.data.data || [];
  const permissionData = await getPermission();
  const initialPermission = permissionData.data.data || [];
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-center">
        <h1 className="text-2xl font-bold text-white">Role List</h1>
      </div>
      <RolePageContent
        initialRoles={initialRoles}
        initialPermission={initialPermission}
      />
    </div>
  );
}
export default RolesPage;
