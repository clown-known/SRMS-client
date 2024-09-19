"use client";

import React, { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, LayersControl, LayerGroup, useMapEvents, useMap } from 'react-leaflet';

const { BaseLayer, Overlay } = LayersControl;

interface MapProps {
  center?: [number, number];
  moveToCurrentLocation?: boolean;
}

const MapContent = ({ center, moveToCurrentLocation }: MapProps) => {
  const [redIcon, setRedIcon] = useState<L.Icon | null>(null);
  const [blueIcon, setBlueIcon] = useState<L.Icon | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [points, setPoints] = useState<any[]>([]);
  const map = useMap();

  useEffect(() => {
    const redIconInstance = L.icon({
      iconUrl: '/assets/icons/marker-icon-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    setRedIcon(redIconInstance);

    const blueIconInstance = L.icon({
      iconUrl: '/assets/icons/marker-icon-blue.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
    setBlueIcon(blueIconInstance);

    const fetchPoints = async () => {
      try {
        const response = await fetch('http://localhost:3005/points');
        if (!response.ok) {
          throw new Error('Failed to fetch points');
        }
        const data = await response.json();
        setPoints(data.data.data || []);
      } catch (error) {
        console.error('Error fetching points:', error);
      }
    };
    
    fetchPoints();

    if (moveToCurrentLocation && map) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], map.getZoom());
        },
        (error) => {
          console.error('Error getting current position:', error);
        }
      );
    } else if (center && map) {
      map.setView(center, map.getZoom());
    }
  }, [center, moveToCurrentLocation, map]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        const { lat, lng } = event.latlng;
        setMarkerPosition([lat, lng]);
      },
    });
    return null;
  };

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
                <Popup>
                  {point.name}
                </Popup>
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

const Map = ({ center = [0, 0], moveToCurrentLocation = false }: MapProps) => {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <MapContent center={center} moveToCurrentLocation={moveToCurrentLocation} />
    </MapContainer>
  );
};

export default Map;
