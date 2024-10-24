/* eslint-disable react/require-default-props */

'use client';

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  SetStateAction,
  Dispatch,
} from 'react';
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

const MAP_LAYERS = {
  BASE: 'Base',
  DARK: 'Dark',
};

const DEFAULT_CENTER: [number, number] = [0, 0];
const DEFAULT_ZOOM = 8;

const useMapLayer = () => {
  const [selectedLayer, setSelectedLayer] = useState(
    () => localStorage.getItem('selectedMapLayer') || MAP_LAYERS.BASE
  );

  const updateLayer = useCallback((layer: string) => {
    localStorage.setItem('selectedMapLayer', layer);
    setSelectedLayer(layer);
  }, []);

  return { selectedLayer, updateLayer };
};

const LayerChangeTracker = ({
  onLayerChange,
}: {
  onLayerChange: (layer: string) => void;
}) => {
  const map = useMap();

  useEffect(() => {
    const handleLayerChange = (e: L.LayersControlEvent) => {
      if (e.name === 'Base') {
        onLayerChange(MAP_LAYERS.BASE);
      } else if (e.name === 'Dark') {
        onLayerChange(MAP_LAYERS.DARK);
      }
    };

    map.on('baselayerchange', handleLayerChange);
    return () => {
      map.off('baselayerchange', handleLayerChange);
    };
  }, [map, onLayerChange]);

  return null;
};

const MapContent = ({
  center = DEFAULT_CENTER,
  moveToCurrentLocation,
  onMapClick,
  selectedRoutes,
  routes,
  singleRouteMode,
  onPointClick,
}: MapProps) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(
    null
  );
  const [markerAddress, setMarkerAddress] = useState<string | null>(null);
  const [points, setPoints] = useState<PointDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  const routingControlsRef = useRef<{ [key: string]: L.Routing.Control }>({});
  const map = useMap();
  const mapRef = useRef<L.Map>(map);
  const { selectedLayer, updateLayer } = useMapLayer();

  const redIcon = useMemo(
    () =>
      L.icon({
        iconUrl: '/assets/icons/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
    []
  );

  const blueIcon = useMemo(
    () =>
      L.icon({
        iconUrl: '/assets/icons/marker-icon-blue.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      }),
    []
  );

  const fetchPoints = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await pointService.getAllPointsWithoutPagination();
      setPoints(response);
    } catch (error) {
      console.error('Error fetching points:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAddressFromLatLng = useCallback(async (lat: number, lng: number) => {
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
  }, []);

  const handlePointClick = useCallback(
    (point: PointDTO) => {
      if (!mapRef.current || !isMapReady) return;

      if (onPointClick) {
        onPointClick(point);
      }
      const newCenter: [number, number] = [point.latitude, point.longitude];

      mapRef.current.setView(newCenter, DEFAULT_ZOOM, {
        animate: true,
        duration: 500,
      });

      requestAnimationFrame(() => {
        if (!mapRef.current) return;

        const mapWidth = mapRef.current.getSize().x;
        const horizontalOffset = -mapWidth * 0.31;
        const verticalOffset = mapWidth * 0.1;

        try {
          const pointPixel = mapRef.current.latLngToContainerPoint(newCenter);
          const adjustedCenter = mapRef.current.containerPointToLatLng([
            pointPixel.x + horizontalOffset,
            pointPixel.y + verticalOffset,
          ]);

          mapRef.current.flyTo(adjustedCenter, DEFAULT_ZOOM, {
            duration: 1,
          });
        } catch (error) {
          console.error('Error adjusting view:', error);
        }
      });
    },
    [onPointClick, isMapReady]
  );

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    const currentMap = mapRef.current;
    if (!currentMap) return;

    const handleLoad = () => {
      setIsMapReady(true);
    };

    if (currentMap.getZoom() !== undefined) {
      handleLoad();
    } else {
      currentMap.once('load', handleLoad);
    }

    return () => {
      if (currentMap) {
        currentMap.off('load', handleLoad);
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    const initializeMapView = () => {
      if (moveToCurrentLocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            if (mapRef.current && isMapReady) {
              requestAnimationFrame(() => {
                try {
                  mapRef.current?.setView([latitude, longitude], DEFAULT_ZOOM, {
                    animate: false,
                  });
                } catch (error) {
                  console.error('Error setting geolocation view:', error);
                }
              });
            }
          },
          (error) => {
            console.error('Geolocation error:', error);
            if (mapRef.current && isMapReady) {
              requestAnimationFrame(() => {
                try {
                  mapRef.current?.setView(center, DEFAULT_ZOOM, {
                    animate: false,
                  });
                } catch (error) {
                  console.error('Error setting default view:', error);
                }
              });
            }
          }
        );
      }
      // else if (center) {
      //   requestAnimationFrame(() => {
      //     try {
      //       mapRef.current?.setView(center, DEFAULT_ZOOM, {  animate: true, duration: 500 });
      //     } catch (error) {
      //       console.error('Error setting initial view:', error);
      //     }
      //   });
      // }
    };

    initializeMapView();
  }, [center, moveToCurrentLocation, isMapReady]);

  const clearRoutingControls = useCallback(() => {
    Object.values(routingControlsRef.current).forEach((control) => {
      try {
        if (control && control.getPlan) {
          const plan = control.getPlan();
          if (plan && plan.setWaypoints) {
            plan.setWaypoints([]);
          }
        }
        if (mapRef.current && control && control.remove) {
          control.remove();
        }
      } catch (error) {
        console.error('Error clearing routing control:', error);
      }
    });
    routingControlsRef.current = {};
  }, []);

  useEffect(() => {
    return () => {
      clearRoutingControls();
    };
  }, [clearRoutingControls]);

  const addRoutingControl = useCallback(
    (route: RouteDTO) => {
      if (!mapRef.current || !isMapReady) return;

      const waypoints = [
        L.latLng(route.startPoint.latitude, route.startPoint.longitude),
        ...(route.points?.map((point) =>
          L.latLng(point.latitude, point.longitude)
        ) || []),
        L.latLng(route.endPoint.latitude, route.endPoint.longitude),
      ];

      try {
        const routingControl = L.Routing.control({
          waypoints,
          router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1',
            profile: 'driving',
            timeout: 30000,
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

        routingControl.addTo(mapRef.current);
        routingControlsRef.current[route.id] = routingControl;
      } catch (error) {
        console.error('Error adding routing control:', error);
      }
    },
    [isMapReady]
  );

  useEffect(() => {
    if (!mapRef.current || !routes || !isMapReady || isLoading) return;

    const setupRoutes = () => {
      clearRoutingControls();

      routes.forEach((route) => {
        if (
          (selectedRoutes?.includes(route.id) || singleRouteMode) &&
          route.startPoint &&
          route.endPoint
        ) {
          addRoutingControl(route);
        }
      });

      // Handle bounds fitting
      requestAnimationFrame(() => {
        try {
          const allWaypoints = Object.values(
            routingControlsRef.current
          ).flatMap((control) =>
            control
              .getWaypoints()
              .filter((wp) => wp && wp.latLng)
              .map((wp) => wp.latLng)
          );

          if (allWaypoints.length > 1) {
            const bounds = L.latLngBounds(allWaypoints);
            if (bounds.isValid() && mapRef.current) {
              mapRef.current.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 15,
                animate: false,
              });
            }
          } else if (allWaypoints.length === 1 && mapRef.current) {
            mapRef.current.setView(allWaypoints[0], DEFAULT_ZOOM, {
              animate: false,
            });
          }
        } catch (error) {
          console.error('Error fitting bounds:', error);
        }
      });
    };

    setupRoutes();
  }, [
    routes,
    selectedRoutes,
    singleRouteMode,
    isLoading,
    clearRoutingControls,
    addRoutingControl,
    isMapReady,
  ]);

  const MapClickHandler = useCallback(() => {
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
  }, [onMapClick, getAddressFromLatLng]);

  return (
    <>
      {isLoading && <Loading />}
      <LayersControl position="topright">
        <BaseLayer checked={selectedLayer === MAP_LAYERS.BASE} name="Base">
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            minZoom={0}
          />
        </BaseLayer>
        <BaseLayer checked={selectedLayer === MAP_LAYERS.DARK} name="Dark">
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            maxZoom={20}
            minZoom={0}
          />
        </BaseLayer>
        <Overlay checked name="Markers">
          <LayerGroup>
            {points.map((point) => (
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
      <LayerChangeTracker onLayerChange={updateLayer} />

      {markerPosition && (
        <Marker position={markerPosition} icon={blueIcon}>
          <Popup>{markerAddress || 'Unknown place'}</Popup>
        </Marker>
      )}

      <MapClickHandler />
    </>
  );
};

const Map = ({
  center = DEFAULT_CENTER,
  moveToCurrentLocation = false,
  onMapClick,
  onPointClick,
  selectedRoutes,
  routes,
  singleRouteMode,
}: MapProps) => {
  return (
    <MapContainer
      key={`map-${center[0]}-${center[1]}`}
      center={center}
      zoom={DEFAULT_ZOOM}
      style={{ height: '100vh', width: '100%' }}
      attributionControl={false}
      zoomControl
      doubleClickZoom={false}
      scrollWheelZoom
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
