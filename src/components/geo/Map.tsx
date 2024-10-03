import React, { useEffect, useState, useCallback } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, LayersControl, LayerGroup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet-control-geocoder';
import "leaflet-routing-machine";

const { BaseLayer, Overlay } = LayersControl;

interface MapProps {
  center?: [number, number];
  moveToCurrentLocation?: boolean;
  onMapClick?: (lat: number, lng: number) => void;
  selectedRoutes?: number[];
  routes?: Route[];
  singleRouteMode?: boolean;
}

interface Point {
  latitude: number;
  longitude: number;
  name: string;
}

interface Route {
  id: number;
  name: string;
  startPoint: Point;
  endPoint: Point;
  distance: number;
  points: Point[];
}

const MapContent = ({ center, moveToCurrentLocation, onMapClick, selectedRoutes, routes, singleRouteMode }: MapProps) => {
  const [redIcon, setRedIcon] = useState<L.Icon | null>(null);
  const [blueIcon, setBlueIcon] = useState<L.Icon | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [routingControls, setRoutingControls] = useState<L.Routing.Control[]>([]);

  const map = useMap();

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
      const response = await fetch('http://localhost:3002/points');
      if (!response.ok) {
        throw new Error('Failed to fetch points');
      }
      const data = await response.json();
      setPoints(data.data.data || []);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  useEffect(() => {
    if (!map) return;

    const handleMapReady = () => {
      if (moveToCurrentLocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            if (map) {
              map.setView([latitude, longitude], map.getZoom());
            }
          },
          (error) => {
            console.error(error);
          }
        );
      } else if (center) {
        map.setView(center, map.getZoom());
      }
    };

    map.whenReady(handleMapReady);

    return () => {
      map.off('load', handleMapReady);
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
        console.log("Address:", address);
      },
    });
    return null;
  };

  const getAddressFromLatLng = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      if (!response.ok) throw new Error('Geocoding failed');
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!map || !routes) return;

    // Clean up previous routing controls
    routingControls.forEach(control => {
        if (map && control) {
            try {
                map.removeControl(control);
            } catch (error) {
                console.error('Error removing control:', error);
            }
        }
    });
    setRoutingControls([]);

    const newControls: L.Routing.Control[] = [];

    routes.forEach((route) => {
        if ((selectedRoutes && selectedRoutes.includes(route.id)) || singleRouteMode) {
            if (route.startPoint && route.endPoint) {
                const waypoints = [
                    L.latLng(route.startPoint.latitude, route.startPoint.longitude),
                    ...(route.points ? route.points.map(point => L.latLng(point.latitude, point.longitude)) : []),
                    L.latLng(route.endPoint.latitude, route.endPoint.longitude)
                ];

                const routingControl = L.Routing.control({
                    waypoints,
                    router: L.Routing.osrmv1({
                        serviceUrl: 'https://router.project-osrm.org/route/v1',
                        profile: 'driving',
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
                    createMarker: function() { return null; }, 
                  } as any).addTo(map);

                newControls.push(routingControl);
            }
        }
    });

    setRoutingControls(newControls);

    // Zoom to fit all selected routes
    if (newControls.length > 0) {
        const bounds = L.latLngBounds(newControls.flatMap(control =>
            control.getWaypoints().map(wp => wp.latLng)
        ));
        map.fitBounds(bounds);
    }

}, [map, routes, selectedRoutes, singleRouteMode]);

  return (
    <>
      <LayersControl position="topright">
        <BaseLayer checked name="Base">
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png'
            maxZoom={20}
            minZoom={0}
          />
        </BaseLayer>
        <BaseLayer name="Dark map">
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
            maxZoom={20}
            minZoom={0}
          />
        </BaseLayer>
        <Overlay checked name="Markers">
          <LayerGroup>
            {redIcon && points.map((point, index) => (
              <Marker key={index} position={[point.latitude, point.longitude]} icon={redIcon}>
                <Popup>{point.name}</Popup>
              </Marker>
            ))}
          </LayerGroup>
        </Overlay>
      </LayersControl>

      {markerPosition && blueIcon && (
        <Marker position={markerPosition} icon={blueIcon}>
          <Popup>
            {markerPosition[0]}, {markerPosition[1]}
          </Popup>
        </Marker>
      )}

      <MapClickHandler />
    </>
  );
};

const Map = ({ center = [0, 0], moveToCurrentLocation = false, onMapClick, selectedRoutes, routes, singleRouteMode }: MapProps) => {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <MapContent 
        center={center} 
        moveToCurrentLocation={moveToCurrentLocation} 
        onMapClick={onMapClick} 
        selectedRoutes={selectedRoutes}
        routes={routes}
        singleRouteMode={singleRouteMode}
      />
    </MapContainer>
  );
};

export default Map;