interface RouteDTO {
    id: string;

    name: string;

    description: string;

    startPoint: PointDTO;

    endPoint: PointDTO;

    distance: number;

    points: PointDTO[];
}