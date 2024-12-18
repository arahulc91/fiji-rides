import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PickupDropoffLocation } from '../types';

// Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtaGV4ZGQiLCJhIjoiY200cnJocTB2MDE3bTJqcHdhaXRtNHFpayJ9.mfYDB3UC6LURiEqKaSMqZQ';

interface RouteInfo {
  duration: number;  // in minutes
  distance: number;  // in kilometers
}

interface RouteMapProps {
  pickupLocation: PickupDropoffLocation;
  dropoffLocation: PickupDropoffLocation;
  onRouteCalculated?: (routeInfo: RouteInfo) => void;
}

export function RouteMap({ pickupLocation, dropoffLocation, onRouteCalculated }: Readonly<RouteMapProps>) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [178.4420, -17.8035], // Fiji coordinates
      zoom: 9
    });

    map.current.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update route when locations change
  useEffect(() => {
    if (!map.current || !pickupLocation || !dropoffLocation) return;

    const getRoute = async () => {
      try {
        const pickupCoords: [number, number] = [
          Number(pickupLocation.longitude),
          Number(pickupLocation.latitude)
        ];
        const dropoffCoords: [number, number] = [
          Number(dropoffLocation.longitude),
          Number(dropoffLocation.latitude)
        ];

        // Add markers
        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat(pickupCoords)
          .setPopup(new mapboxgl.Popup().setHTML(`<p>${pickupLocation.description}</p>`))
          .addTo(map.current!);

        new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat(dropoffCoords)
          .setPopup(new mapboxgl.Popup().setHTML(`<p>${dropoffLocation.description}</p>`))
          .addTo(map.current!);

        // Get route
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${dropoffCoords[0]},${dropoffCoords[1]}?alternatives=true&geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`
        );
        const json = await query.json();

        if (!json.routes || json.routes.length === 0) {
          console.error('No route found between locations');
          return;
        }

        const route = json.routes[0].geometry;
        const duration = Math.round(json.routes[0].duration / 60); // Convert seconds to minutes
        const distance = Math.round(json.routes[0].distance / 1000 * 10) / 10; // Convert meters to km with 1 decimal

        const info = { duration, distance };
        setRouteInfo(info);

        // Call the callback with the route info if provided
        if (onRouteCalculated) {
          onRouteCalculated(info);
        }

        // Add or update route layer
        if (map.current?.getSource('route')) {
          (map.current.getSource('route') as mapboxgl.GeoJSONSource).setData({
            type: 'Feature',
            properties: {},
            geometry: route
          });
        } else {
          map.current?.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: route
              }
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4,
              'line-opacity': 0.75
            }
          });
        }

        // Fit bounds to show entire route
        const bounds = new mapboxgl.LngLatBounds()
          .extend(pickupCoords)
          .extend(dropoffCoords);

        map.current?.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 1000
        });

      } catch (error) {
        console.error('Error getting route:', error);
      }
    };

    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) markers[0].remove();

    getRoute();
  }, [pickupLocation, dropoffLocation, onRouteCalculated]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />
      
      {/* Route Info Box */}
      {routeInfo && (
        <div className="absolute top-2 right-16 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[100px]">
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-primary-600">Estimated Time</p>
              <p className="text-base font-semibold text-secondary-700">
                {routeInfo.duration} minutes
              </p>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <p className="text-xs font-medium text-primary-600">Distance</p>
              <p className="text-base font-semibold text-secondary-700">
                {routeInfo.distance} km
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}