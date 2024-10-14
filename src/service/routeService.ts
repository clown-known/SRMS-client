import axiosInstance from '../../axiosConfig';

export interface RouteResponse {
  statusCode: number;
  message: string;
  timestamp: number;
  version: string;
  path: string;
  data: {
    data: RouteDTO[];
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
export interface CreateRouteDTO {
  name: string;
  description: string;
  startPointId: string;
  endPointId: string;
  distance: number;
  estimatedTime: number;
}

class RouteService {
  private readonly url = '/route-service/routes';

  async getAllRoutes(
    page: number = 1,
    take: number = 10,
    searchKey?: string
  ): Promise<RouteResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        take: take.toString(),
        ...(searchKey && { searchKey }),
      });
      const response = await axiosInstance.get<RouteResponse>(
        `${this.url}?${params}`
      );
      return response.data;
    } catch (error) {
      throw new Error('fetch routes list failed');
    }
  }

  async getRouteById(id: string): Promise<RouteDTO> {
    try {
      const response = await axiosInstance.get<{ data: RouteDTO }>(
        `${this.url}/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw new Error('Fetch route detail failed');
    }
  }

  async createRoute(routeData: CreateRouteDTO): Promise<RouteDTO> {
    try {
      const response = await axiosInstance.post<{ data: RouteDTO }>(
        `${this.url}`,
        routeData
      );
      return response.data.data;
    } catch (error) {
      throw new Error('Route creation failed');
    }
  }

  async updateRoute(
    id: string,
    routeData: Partial<RouteDTO>
  ): Promise<RouteDTO> {
    try {
      const response = await axiosInstance.patch<{ data: RouteDTO }>(
        `${this.url}/${id}`,
        routeData
      );
      return response.data.data;
    } catch (error) {
      throw new Error('Fetch route update failed');
    }
  }

  async deleteRoute(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.url}/${id}`);
    } catch (error) {
      throw new Error('Fetch route delete failed');
    }
  }
}

export const routeService = new RouteService();
