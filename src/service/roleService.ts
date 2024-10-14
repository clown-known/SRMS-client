import axiosInstance from "../../axiosConfig";

export interface RolesPage{
  data: RoleDTO[];
      meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
      };
}

export interface RoleResponse {
  data: {
    data: RoleDTO[];
    meta: {
      page: number;
      take: number;
      itemCount: number;
      pageCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
}
export interface PermissionResponse {
  data: {
    data: PermissionDTO[];
    meta: {
      page: number;
      take: number;
      itemCount: number;
      pageCount: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
    };
  };
}

interface CreateRoleRequest {
  name: string;
  permissions?: PermissionId[]
}
interface PermissionId{
  id:string
}

export function mapToCreateRoleRequest(data: { name: string; permissions: string[] }) {
  return {
    name: data.name,
    permissions: data.permissions?.map((id) => ({ id })) || [],
  };
}
export async function getRoles(page: number = 1, take: number = 10): Promise<RolesPage> {
  const response = await axiosInstance.get<RoleResponse>('authentication-service/role', {
    params: { page, take }
  });
  return response.data.data;
}

export async function searchRoles(searchKey: string, page: number = 1, take: number = 10): Promise<RolesPage> {
  const response = await axiosInstance.get<RoleResponse>('authentication-service/role', {
    params: { searchKey, page, take }
  });
  return response.data.data;
}
export async function getPermission(): Promise<PermissionResponse> {
  const response = await axiosInstance.get<PermissionResponse>('authentication-service/permission');
  return response.data;
}
export async function CreateRole(data: CreateRoleRequest): Promise<PermissionResponse> {
  const response = await axiosInstance.post<PermissionResponse>('authentication-service/role/create',data);
  return response.data;
}
export async function updateRole(id: string, data: CreateRoleRequest): Promise<PermissionResponse> {
  const response = await axiosInstance.put<PermissionResponse>(`authentication-service/role/${id}`,data);
  return response.data;
}
export async function deleteRole(id: string): Promise<PermissionResponse> {
  const response = await axiosInstance.delete<PermissionResponse>(`authentication-service/role/${id}`);
  return response.data;
}