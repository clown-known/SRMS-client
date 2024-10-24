interface RoleDTO{
    id: string;
    name: string;
    isAdmin?: boolean;
    rolePermissions?: PermissionInRoleDTO[]
}