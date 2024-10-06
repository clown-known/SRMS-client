import axiosInstance from "../../axiosConfig";


export interface PointsResponse {
    data: {
        data: PointDTO[];
        meta: {
            itemCount: number;
            totalItems: number;
            itemsPerPage: number;
            totalPages: number;
            currentPage: number;
        };
    };
}

class PointService {
    private readonly url = '/points';

    async getAllPoints(page: number = 1, take: number = 10, searchKey?: string): Promise<PointsResponse> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                take: take.toString(),
                ...(searchKey && { searchKey }),
            });
            const response = await axiosInstance.get<PointsResponse>(`${this.url}?${params}`)
            return response.data;
        } catch (error) {
            throw new Error("fetch points list failed");
        }
    }

    async getPointById(id: string): Promise<PointDTO> {
        try {
            const response = await axiosInstance.get<{ data: PointDTO }>(`${this.url}/${id}`);
            return response.data.data;
        } catch (error) {
            throw new Error("Fetch point detail failed");
        }
    }

    async createPoint(pointData: Omit<PointDTO, 'id'>): Promise<PointDTO> {
        try {
            const response = await axiosInstance.post<{ data: PointDTO }>(this.url, pointData);
            return response.data.data;
        } catch (error) {
            throw new Error("Fetch point create failed");
        }
    }

    async updatePoint(id: string, pointData: Partial<PointDTO>): Promise<PointDTO> {
        try {
            const response = await axiosInstance.patch<{ data: PointDTO }>(`${this.url}/${id}`, pointData);
            return response.data.data;
        } catch (error) {
            throw new Error("Fetch point update failed");
        }
    }

    async deletePoint(id: string): Promise<void> {
        try {
            await axiosInstance.delete(`${this.url}/${id}`);
        } catch (error) {
            throw new Error("Fetch point delete failed");
        }
    }
}

export const pointService = new PointService();