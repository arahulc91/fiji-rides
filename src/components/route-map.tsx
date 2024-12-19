import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { PickupDropoffLocation } from "../types";
import * as turf from "@turf/turf";
import type { Feature, LineString, Position } from 'geojson';

// Replace with your Mapbox access token
mapboxgl.accessToken =
  "pk.eyJ1IjoiaWFtaGV4ZGQiLCJhIjoiY200cnJocTB2MDE3bTJqcHdhaXRtNHFpayJ9.mfYDB3UC6LURiEqKaSMqZQ";

interface RouteInfo {
  duration: number; // in minutes
  distance: number; // in kilometers
}

interface RouteGeometry {
  type: 'LineString';
  coordinates: Position[];
}

interface MapboxRoute {
  geometry: RouteGeometry;
  duration: number;
  distance: number;
}

interface RouteMapProps {
  pickupLocation: PickupDropoffLocation;
  dropoffLocation: PickupDropoffLocation;
  onRouteCalculated?: (routeInfo: RouteInfo) => void;
}

export function RouteMap({
  pickupLocation,
  dropoffLocation,
  onRouteCalculated,
}: Readonly<RouteMapProps>) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const carMarker = useRef<mapboxgl.Marker | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const getPointAlongRoute = useCallback((route: { geometry: RouteGeometry }, progress: number): Position => {
    try {
      const lineString: Feature<LineString> = {
        type: 'Feature',
        geometry: route.geometry,
        properties: {}
      };
      
      const length = turf.length(lineString);
      const targetDistance = length * progress;
      const point = turf.along(lineString, targetDistance);
      
      return point.geometry.coordinates;
    } catch (error) {
      console.error('Error in getPointAlongRoute:', error);
      return route.geometry.coordinates[0];
    }
  }, []);

  const animateMarker = useCallback((route: { geometry: RouteGeometry }) => {
    let start = performance.now();
    const duration = 20000; // Increased duration for smoother movement
    let lastPoint: Position | null = null;
    let lastBearing = 0;

    const animate = (timestamp: number) => {
      const progress = (timestamp - start) / duration;

      if (progress > 1) {
        start = performance.now();
      }

      const currentPoint = getPointAlongRoute(route, progress % 1);
      
      if (carMarker.current && map.current) {
        carMarker.current.setLngLat(currentPoint as [number, number]);
        
        try {
          // Get next point for bearing calculation
          const upcoming = getPointAlongRoute(route, (progress + 0.001) % 1); // Reduced look-ahead distance
          const bearing = turf.bearing(
            turf.point(currentPoint),
            turf.point(upcoming)
          );

          // Smooth rotation using interpolation
          if (lastPoint && Math.abs(bearing - lastBearing) > 180) {
            // Handle 360-degree wrap around
            if (bearing < lastBearing) {
              lastBearing -= 360;
            } else {
              lastBearing += 360;
            }
          }

          const smoothBearing = lastPoint 
            ? lastBearing + (bearing - lastBearing) * 0.1 // Interpolation factor
            : bearing;

          carMarker.current.setRotation(smoothBearing);
          
          lastPoint = currentPoint;
          lastBearing = smoothBearing;
        } catch (error) {
          console.error('Error calculating bearing:', error);
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);
  }, [getPointAlongRoute]);

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [178.442, -17.8035], // Fiji coordinates
      zoom: 9,
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
          Number(pickupLocation.latitude),
        ];
        const dropoffCoords: [number, number] = [
          Number(dropoffLocation.longitude),
          Number(dropoffLocation.latitude),
        ];

        // Add markers
        new mapboxgl.Marker({ color: "#22c55e" })
          .setLngLat(pickupCoords)
          .setPopup(
            new mapboxgl.Popup().setHTML(`<p>${pickupLocation.description}</p>`)
          )
          .addTo(map.current!);

        new mapboxgl.Marker({ color: "#ef4444" })
          .setLngLat(dropoffCoords)
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<p>${dropoffLocation.description}</p>`
            )
          )
          .addTo(map.current!);

        // Get route
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${dropoffCoords[0]},${dropoffCoords[1]}?alternatives=true&geometries=geojson&overview=full&steps=true&access_token=${mapboxgl.accessToken}`
        );
        const json = await query.json();

        if (!json.routes || json.routes.length === 0) {
          console.error("No route found between locations");
          return;
        }

        const route = json.routes[0] as MapboxRoute;
        
        // Ensure route geometry is properly structured
        if (!route.geometry || !route.geometry.coordinates || !Array.isArray(route.geometry.coordinates)) {
          console.error('Invalid route geometry:', route.geometry);
          return;
        }

        // Log the route structure to verify the data
        console.log('Route geometry:', {
          type: route.geometry.type,
          coordinatesLength: route.geometry.coordinates.length
        });

        const duration = Math.round(route.duration / 60);
        const distance = Math.round((route.distance / 1000) * 10) / 10;

        const info = { duration, distance };
        setRouteInfo(info);

        if (onRouteCalculated) {
          onRouteCalculated(info);
        }

        // Add or update route layer
        if (map.current?.getSource("route")) {
          const source = map.current.getSource("route") as mapboxgl.GeoJSONSource;
          source.setData({
            type: "Feature",
            properties: {},
            geometry: route.geometry,
          } as Feature<LineString>);
        } else {
          map.current?.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route.geometry,
              },
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3b82f6",
              "line-width": 4,
              "line-opacity": 0.75,
            },
          });
        }

        // Fit bounds to show entire route
        const bounds = new mapboxgl.LngLatBounds()
          .extend(pickupCoords)
          .extend(dropoffCoords);

        map.current?.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          duration: 1000,
        });

        // Update car marker position and start animation
        if (!carMarker.current) {
          const el = document.createElement("div");
          el.className = "car-marker";
          el.innerHTML = `<img src="/src/assets/FijiRides.svg" class="w-12 h-12" style="transform: rotate(270deg);" alt="Fiji Rides Vehicle" />`;

          carMarker.current = new mapboxgl.Marker({
            element: el,
            rotationAlignment: 'map',
            pitchAlignment: 'map',
          })
            .setLngLat(pickupCoords)
            .addTo(map.current!);
        } else {
          carMarker.current.setLngLat(pickupCoords);
        }

        // Clear any existing animation
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }

        // Start animation with properly structured route
        animateMarker({
          geometry: {
            type: 'LineString',
            coordinates: route.geometry.coordinates
          }
        });
      } catch (error) {
        console.error('Error getting route:', error);
      }
    };

    // Clear existing markers
    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers[0]) markers[0].remove();

    getRoute();
  }, [pickupLocation, dropoffLocation, onRouteCalculated, animateMarker]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full rounded-xl overflow-hidden"
      />

      {/* Route Info Box */}
      {routeInfo && (
        <div className="absolute top-2 right-16 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 min-w-[100px]">
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium text-primary-600">
                Estimated Time
              </p>
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
