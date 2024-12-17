import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { PickupDropoffLocation } from '../types';

// Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaWFtaGV4ZGQiLCJhIjoiY200cnJocTB2MDE3bTJqcHdhaXRtNHFpayJ9.mfYDB3UC6LURiEqKaSMqZQ';

interface RouteMapProps {
  pickupLocation: PickupDropoffLocation;
  dropoffLocation: PickupDropoffLocation;
}

// Define known Fiji locations and their coordinates
const FIJI_LOCATIONS: Record<string, [number, number]> = {
  // Airports
  "Nadi International Airport": [177.4432, -17.7553],
  "Nausori International Airport": [178.5569, -18.0433],
  
  // Popular Hotels/Resorts in Denarau
  "Sofitel Fiji Resort and Spa": [177.3657, -17.7687],
  "Hilton Fiji Beach Resort": [177.3678, -17.7676],
  "Sheraton Fiji Golf & Beach Resort": [177.3667, -17.7697],
  "Radisson Blu Resort Fiji": [177.3647, -17.7707],
  "The Westin Denarau Island Resort": [177.3657, -17.7717],
  "Wyndham Resort Denarau": [177.3637, -17.7727],
  
  // Popular Areas
  "Denarau Marina": [177.3677, -17.7667],
  "Port Denarau": [177.3677, -17.7667],
  
  // Popular Hotels/Resorts in Coral Coast
  "Outrigger Fiji Beach Resort": [177.8283, -18.2217],
  "InterContinental Fiji Golf Resort": [177.7667, -18.2167],
  "Shangri-La Yanuca Island": [177.8500, -18.2167],
  "Warwick Fiji": [177.7833, -18.2333],
  "Naviti Resort": [177.7667, -18.2167],
  
  // Other Popular Locations
  "Garden of the Sleeping Giant": [177.4833, -17.6833],
  "Sri Siva Subramaniya Temple": [177.4517, -17.7533],
  "First Landing Beach Resort & Villas": [177.3833, -17.6667],
};

export function RouteMap({ pickupLocation, dropoffLocation }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [178.4420, -17.8035], // Fiji coordinates
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Clean up
    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || !pickupLocation || !dropoffLocation) return;

    // Function to get coordinates from location name
    const getCoordinates = async (locationName: string): Promise<[number, number] | null> => {
      try {
        // First, check our predefined locations
        for (const [knownLocation, coordinates] of Object.entries(FIJI_LOCATIONS)) {
          if (locationName.toLowerCase().includes(knownLocation.toLowerCase())) {
            console.log(`Found exact match for "${locationName}":`, coordinates);
            return coordinates;
          }
        }

        // If no exact match, try Mapbox geocoding with Fiji bounding box
        const bbox = '176.82,-19.35,180.24,-15.71'; // Fiji bounding box
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationName)}.json?country=fj&bbox=${bbox}&limit=1&access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          console.log(`Found Mapbox location for "${locationName}":`, data.features[0]);
          return data.features[0].center as [number, number];
        }

        // If still no result, try with explicit Fiji context
        const fallbackResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationName + ', Fiji')}.json?limit=1&access_token=${mapboxgl.accessToken}`
        );
        const fallbackData = await fallbackResponse.json();

        if (fallbackData.features && fallbackData.features.length > 0) {
          console.log(`Found fallback location for "${locationName}":`, fallbackData.features[0]);
          return fallbackData.features[0].center as [number, number];
        }

        console.error('Location not found:', locationName);
        return null;
      } catch (error) {
        console.error('Error getting coordinates for', locationName, ':', error);
        return null;
      }
    };

    // Function to get and display route
    const getRoute = async () => {
      try {
        console.log('Searching for pickup:', pickupLocation.description);
        console.log('Searching for dropoff:', dropoffLocation.description);

        // Get coordinates for both locations
        const pickupCoords = await getCoordinates(pickupLocation.description);
        const dropoffCoords = await getCoordinates(dropoffLocation.description);

        if (!pickupCoords || !dropoffCoords) {
          console.error('Could not find coordinates for one or both locations');
          return;
        }

        // Add markers for pickup and dropoff
        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat(pickupCoords)
          .setPopup(new mapboxgl.Popup().setHTML(`<p>${pickupLocation.description}</p>`))
          .addTo(map.current!);

        new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat(dropoffCoords)
          .setPopup(new mapboxgl.Popup().setHTML(`<p>${dropoffLocation.description}</p>`))
          .addTo(map.current!);

        // Get route with alternatives and overview
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${dropoffCoords[0]},${dropoffCoords[1]}?alternatives=true&geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`
        );
        const json = await query.json();

        if (!json.routes || json.routes.length === 0) {
          console.error('No route found between:', {
            pickup: pickupLocation.description,
            dropoff: dropoffLocation.description,
            pickupCoords,
            dropoffCoords
          });
          return;
        }

        const route = json.routes[0].geometry;

        // Add route to map
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

        // Fit bounds to show entire route with padding
        const bounds = new mapboxgl.LngLatBounds()
          .extend(pickupCoords)
          .extend(dropoffCoords);

        map.current?.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 1000
        });

        // Log full location data for debugging
        console.log('Route details:', {
          pickup: {
            description: pickupLocation.description,
            coordinates: pickupCoords
          },
          dropoff: {
            description: dropoffLocation.description,
            coordinates: dropoffCoords
          },
          route: route
        });

      } catch (error) {
        console.error('Error getting route:', error);
      }
    };

    // Clear existing markers
    const markers = document.getElementsByClassName('mapboxgl-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    getRoute();
  }, [pickupLocation, dropoffLocation]);

  return (
    <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden" />
  );
}