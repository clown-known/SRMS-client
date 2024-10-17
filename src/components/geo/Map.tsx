import React, { useEffect, useState, useCallback, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  LayersControl,
  LayerGroup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { pointService } from '@/service/pointService';
import Loading from '../Loading';

const { BaseLayer, Overlay } = LayersControl;

interface MapProps {
  center?: [number, number];
  moveToCurrentLocation?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  selectedRoutes?: string[];
  routes?: RouteDTO[];
  singleRouteMode?: boolean;
  onPointClick?: (point: PointDTO) => void;
}

const MapContent = ({
  center,
  moveToCurrentLocation,
  onMapClick,
  selectedRoutes,
  routes,
  singleRouteMode,
  onPointClick,
}: MapProps) => {
  const [redIcon, setRedIcon] = useState<L.Icon | null>(null);
  const [blueIcon, setBlueIcon] = useState<L.Icon | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [markerAddress, setMarkerAddress] = useState<string | null>(null);
  const [points, setPoints] = useState<PointDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const routingControlsRef = useRef<{ [key: string]: L.Routing.Control }>({});
  const mapRef = useRef<L.Map | null>(null);
  const initialViewSet = useRef(false);

  const map = useMap();
  mapRef.current = map;

  useEffect(() => {
    const redIconMarker = L.icon({
      iconUrl: '/assets/icons/marker-icon-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    setRedIcon(redIconMarker);

    const blueIconMarker = L.icon({
      iconUrl: '/assets/icons/marker-icon-blue.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    setBlueIcon(blueIconMarker);
  }, []);

  const fetchPoints = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await pointService.getAllPoints();
      setPoints(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  useEffect(() => {
    if (!map || initialViewSet.current) return;

    const handleMapReady = () => {
      try {
        
        if (moveToCurrentLocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              if (map) {
                map.setView([latitude, longitude], 8);
                initialViewSet.current = true;
              }
            },
            (error) => {
              console.error(error);
              if (center) {
                map.setView(center, map.getZoom());
                initialViewSet.current = true;
              }
            }
          );
        } else if (center) {
          map.setView(center, map.getZoom());
          initialViewSet.current = true;
        }
      } catch (error) {
        console.error('Error setting map view:', error);
      }
    };

    map.whenReady(handleMapReady);

    return () => {
      if (map) {
        map.off('load', handleMapReady);
      }
    };
  }, [center, moveToCurrentLocation, map]);

  const MapClickHandler = () => {
    useMapEvents({
      click: async (event) => {
        const { lat, lng } = event.latlng;
        setMarkerPosition([lat, lng]);
        if (onMapClick) {
          onMapClick(lat, lng);
        }

        const address = await getAddressFromLatLng(lat, lng);
        setMarkerAddress(address);
      },
    });
    return null;
  };

  const getAddressFromLatLng = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      if (!response.ok) throw new Error('Geocoding failed');
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error getting address:', error);
      return null;
    }
  };

  const handlePointClick = (point: PointDTO) => {
    if (onPointClick) {
      onPointClick(point);
    }
  
    const fixedZoomLevel = 8;
  
    const newCenter: [number, number] = [point.latitude, point.longitude];
  
    map.setView(newCenter, fixedZoomLevel, {
      animate: true,
      duration: 0.5,
    });
  
    setTimeout(() => {
      const mapWidth = map.getSize().x;
  
      const horizontalOffset = -mapWidth * 0.31;

      const verticalOffset = mapWidth * 0.1;
  
      const pointPixel = map.latLngToContainerPoint(newCenter);
  
      const adjustedCenter = map.containerPointToLatLng([
        pointPixel.x + horizontalOffset,
        pointPixel.y + verticalOffset,
      ]);
  
      map.flyTo(adjustedCenter, fixedZoomLevel, {
        animate: true,
        duration: 0.6,
      });
    }, 600);
  };
  

  useEffect(() => {
    if (!map || !routes || isLoading) return;


    try {
      Object.keys(routingControlsRef.current).forEach((routeId) => {
        if (!selectedRoutes?.includes(routeId) && !singleRouteMode) {
          if (mapRef.current) {
            mapRef.current.removeControl(routingControlsRef.current[routeId]);
          }
          delete routingControlsRef.current[routeId];
        }
      });
    } catch (error) {
      console.error('Error removing route:', error);
    }
    try {
      routes.forEach((route) => {
        if (
          (selectedRoutes?.includes(route.id) || singleRouteMode) &&
          route.startPoint &&
          route.endPoint
        ) {
          const waypoints = [
            L.latLng(route.startPoint.latitude, route.startPoint.longitude),
            ...(route.points
              ? route.points.map((point) =>
                  L.latLng(point.latitude, point.longitude)
                )
              : []),
            L.latLng(route.endPoint.latitude, route.endPoint.longitude),
          ];
  
          if (routingControlsRef.current[route.id]) {
            routingControlsRef.current[route.id].setWaypoints(waypoints);
          } else {
            const routingControl = L.Routing.control({
              waypoints,
              router: L.Routing.osrmv1({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                profile: 'driving',
                timeout: 20000,
              }),
              lineOptions: {
                styles: [{ color: 'blue', weight: 4, opacity: 0.7 }],
                extendToWaypoints: true,
                missingRouteTolerance: 100,
              },
              addWaypoints: false,
              fitSelectedRoutes: true,
              showAlternatives: false,
              routeWhileDragging: false,
              show: false,
              createMarker: () => null,
            } as any);
  
            if (mapRef.current) {
              routingControl.addTo(mapRef.current);
              routingControlsRef.current[route.id] = routingControl;
            }
          }
        }
      });
    } catch (error) {
      throw new Error('error');
    }

    

    const allWaypoints = Object.values(routingControlsRef.current).flatMap(
      (control) => control.getWaypoints().map((wp) => wp.latLng)
    );

    if (allWaypoints.length > 0) {
      const bounds = L.latLngBounds(allWaypoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, routes, selectedRoutes, singleRouteMode, isLoading]);

  useEffect(() => {
    if (!map || !routes) return;

    Object.keys(routingControlsRef.current).forEach((routeId) => {
      if (!selectedRoutes?.includes(routeId) && !singleRouteMode) {
        const routingControl = routingControlsRef.current[routeId];
        if (routingControl) {
          map.removeControl(routingControl);
          delete routingControlsRef.current[routeId];
        }
      }
    });
  }, [map, routes, selectedRoutes, singleRouteMode, isLoading]);

  return (
    <>
      {isLoading && <Loading />}
      <LayersControl position="topright">
        <BaseLayer checked name="Base">
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            minZoom={0}
          />
        </BaseLayer>
        <BaseLayer name="Dark map">
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            minZoom={0}
          />
        </BaseLayer>
        <Overlay checked name="Markers">
          <LayerGroup>
            {redIcon &&
              points.map((point) => (
                <Marker
                  key={point.id}
                  position={[point.latitude, point.longitude]}
                  icon={redIcon}
                  eventHandlers={{
                    click: () => handlePointClick(point),
                  }}
                >
                  <Popup>{point.name}</Popup>
                </Marker>
              ))}
          </LayerGroup>
        </Overlay>
      </LayersControl>

      {markerPosition && blueIcon && (
        <Marker position={markerPosition} icon={blueIcon}>
          <Popup>{markerAddress ? markerAddress : 'Unknown place'}</Popup>
        </Marker>
      )}

      <MapClickHandler />
    </>
  );
};

const Map = ({
  center = [0, 0],
  moveToCurrentLocation = false,
  onMapClick,
  onPointClick,
  selectedRoutes,
  routes,
  singleRouteMode,
}: MapProps) => {
  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <MapContent
        center={center}
        moveToCurrentLocation={moveToCurrentLocation}
        onMapClick={onMapClick}
        onPointClick={onPointClick}
        selectedRoutes={selectedRoutes}
        routes={routes}
        singleRouteMode={singleRouteMode}
      />
    </MapContainer>
  );
};

export default Map;
