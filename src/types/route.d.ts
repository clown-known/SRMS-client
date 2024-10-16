interface RouteDTO {
  id: string;

  name: string;

  description: string;

  startPoint: PointDTO;

  endPoint: PointDTO;

  distance: number;

  estimatedTime: number;

  startPointId?: string;

  endPointId?: string;

  points?: PointDTO[];
}
