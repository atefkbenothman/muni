"use client";

import { Tables } from "@/types/database.types";

import { useRef, useEffect, useState, useCallback } from "react";
import { MapControls } from "@/components/map-controls";
import type { VehicleActivity } from "@/types/transit-types";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRealtimeVehicles } from "@/hooks/use-vehicles";
import { useTransitData } from "@/hooks/use-transit";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
const MAP_CONFIG = {
  style: "mapbox://styles/mapbox/streets-v11",
  center: [-122.4194, 37.7749] as [number, number],
  zoom: 12,
};
const REFRESH_INTERVAL = 600;
const DEFAULT_AGENCY = "SF";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

const createMarkerElement = () => {
  const el = document.createElement("div");
  el.className = "marker";
  el.textContent = "🚌";
  el.style.fontSize = "24px";
  el.style.lineHeight = "24px";
  return el;
};

const createVehicleMarker = (
  vehicle: VehicleActivity,
  onMarkerClick: (lineRef: string) => void
) => {
  const { MonitoredVehicleJourney: journey } = vehicle;
  if (!journey.LineRef) return null;

  const popup = new mapboxgl.Popup({ maxWidth: "350px" }).setHTML(
    createPopupMarker(vehicle)
  );

  const marker = new mapboxgl.Marker(createMarkerElement())
    .setLngLat([
      Number.parseFloat(journey.VehicleLocation.Longitude),
      Number.parseFloat(journey.VehicleLocation.Latitude),
    ])
    .setPopup(popup);

  marker.getElement().addEventListener("click", (e) => {
    e.stopPropagation();
    if (journey.LineRef) {
      onMarkerClick(journey.LineRef);
      marker.togglePopup();
    }
  });

  return marker;
};

const createPopupMarker = (vehicle: VehicleActivity) => {
  return `
    <div class="p-3" style="color: black; max-width: 300px;">
      <h3 class="font-bold mb-2">Vehicle Information</h3>
      <div class="space-y-1">
        <p><span class="font-semibold">Line:</span> ${
          vehicle.MonitoredVehicleJourney.LineRef
        }</p>
        <p><span class="font-semibold">Vehicle ID:</span> ${
          vehicle.MonitoredVehicleJourney.VehicleRef
        }</p>
        <p><span class="font-semibold">Direction:</span> ${
          vehicle.MonitoredVehicleJourney.DirectionRef || "N/A"
        }</p>
        <p><span class="font-semibold">Route Name:</span> ${
          vehicle.MonitoredVehicleJourney.PublishedLineName || "N/A"
        }</p>
        <p><span class="font-semibold">Operator:</span> ${
          vehicle.MonitoredVehicleJourney.OperatorRef
        }</p>
        <p><span class="font-semibold">Origin:</span> ${
          vehicle.MonitoredVehicleJourney.OriginName || "N/A"
        }</p>
        <p><span class="font-semibold">Destination:</span> ${
          vehicle.MonitoredVehicleJourney.DestinationName || "N/A"
        }</p>
        <p><span class="font-semibold">Status:</span> ${
          vehicle.MonitoredVehicleJourney.Monitored
            ? "Monitored"
            : "Not Monitored"
        }</p>
        <p><span class="font-semibold">Congestion:</span> ${
          vehicle.MonitoredVehicleJourney.InCongestion ? "Yes" : "No"
        }</p>
        <p><span class="font-semibold">Occupancy:</span> ${
          vehicle.MonitoredVehicleJourney.Occupancy || "N/A"
        }</p>
        <p><span class="font-semibold">Bearing:</span> ${
          vehicle.MonitoredVehicleJourney.Bearing
        }°</p>
        <p><span class="font-semibold">Last Updated:</span> ${new Date(
          vehicle.RecordedAtTime
        ).toLocaleString()}</p>
      </div>
    </div>
  `;
};

const createStopMarkerElement = () => {
  const el = document.createElement("div");
  el.className = "stop-marker";
  el.textContent = "🚏";
  el.style.fontSize = "20px";
  el.style.lineHeight = "20px";
  return el;
};

const createStopMarker = (stop: Tables<"stops">) => {
  if (!stop["Location/Latitude"] || !stop["Location/Longitude"]) return;
  return new mapboxgl.Marker(createStopMarkerElement())
    .setLngLat([
      Number.parseFloat(stop["Location/Longitude"].toString()),
      Number.parseFloat(stop["Location/Latitude"].toString()),
    ])
    .setPopup(
      new mapboxgl.Popup({ maxWidth: "300px" }).setHTML(
        createStopPopupContent(stop)
      )
    );
};

const createStopPopupContent = (stop: Tables<"stops">) => {
  return `
    <div class="p-3" style="color: black; max-width: 250px;">
      <h3 class="font-bold mb-2">Stop Information</h3>
      <div class="space-y-1">
        <p><span class="font-semibold">Name:</span> ${stop.Name}</p>
        <p><span class="font-semibold">Stop ID:</span> ${stop.id}</p>
        <p><span class="font-semibold">Type:</span> ${stop.StopType}</p>
        ${
          stop["Extensions/PlatformCode"]
            ? `<p><span class="font-semibold">Platform:</span> ${stop["Extensions/PlatformCode"]}</p>`
            : ""
        }
        ${
          stop.Url
            ? `<p><a href="${stop.Url}" target="_blank" class="text-blue-500 hover:underline">More Info</a></p>`
            : ""
        }
      </div>
    </div>
  `;
};

const filterVehiclesByLine = (
  vehicles: VehicleActivity[],
  selectedLine: string,
  transitLines: Tables<"lines">[]
): VehicleActivity[] => {
  if (!selectedLine || selectedLine === "All") return vehicles;
  // Find the matching transit line
  const matchingLine = transitLines.find(
    (line) => line.Id === selectedLine || line.SiriLineRef === selectedLine
  );
  return vehicles.filter((vehicle) => {
    const lineRef = vehicle.MonitoredVehicleJourney.LineRef;
    // Check against both the SiriLineRef and the direct LineRef
    return lineRef === matchingLine?.SiriLineRef || lineRef === selectedLine;
  });
};

type MuniMapProps = {
  lines: Tables<"lines">[];
  stops: Tables<"stops">[];
  operators: Tables<"operators">[];
};

export function MuniMap({ lines, stops, operators }: MuniMapProps) {
  const {
    selectedOperator,
    setSelectedOperator,
    selectedLine,
    setSelectedLine,
  } = useTransitData(DEFAULT_AGENCY);
  const { vehicles, countdown } = useRealtimeVehicles(REFRESH_INTERVAL);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const vehicleMarkers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const stopMarkers = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const [showStops, setShowStops] = useState(false);

  // Initialize Mapbox map
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      ...MAP_CONFIG,
    });
  }, []);

  // Filter vehicles
  useEffect(() => {
    if (!map.current) return;

    Object.values(vehicleMarkers.current).forEach((marker) => marker.remove());
    vehicleMarkers.current = {};

    const filteredVehicles = filterVehiclesByLine(
      vehicles,
      selectedLine,
      lines
    );

    filteredVehicles.forEach((vehicle) => {
      const marker = createVehicleMarker(vehicle, handleMarkerClick);
      if (marker) {
        marker.addTo(map.current!);
        vehicleMarkers.current[vehicle.MonitoredVehicleJourney.VehicleRef] =
          marker;
      }
    });
  }, [vehicles, selectedLine, lines]);

  useEffect(() => {
    if (!map.current) return;

    Object.values(stopMarkers.current).forEach((marker) => marker.remove());
    stopMarkers.current = {};

    stops.forEach((stop) => {
      const marker = createStopMarker(stop);
      if (marker) {
        marker.addTo(map.current!);
        stopMarkers.current[stop.id] = marker;
      }
    });
  }, [stops]);

  useEffect(() => {
    return () => {
      Object.values(vehicleMarkers.current).forEach((marker) =>
        marker.remove()
      );
      Object.values(stopMarkers.current).forEach((marker) => marker.remove());
    };
  }, []);

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperator(e.target.value);
  };

  const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLine(e.target.value);
  };

  const handleMarkerClick = useCallback((lineRef: string) => {
    setSelectedLine(lineRef);
  }, []);

  const handleResetFilter = useCallback(() => {
    setSelectedLine("All");
  }, []);

  // Update the stops effect to respect the showStops state
  useEffect(() => {
    if (!map.current) return;

    Object.values(stopMarkers.current).forEach((marker) => marker.remove());
    stopMarkers.current = {};

    if (showStops) {
      stops.forEach((stop) => {
        const marker = createStopMarker(stop);
        if (marker) {
          marker.addTo(map.current!);
          stopMarkers.current[stop.id] = marker;
        }
      });
    }
  }, [stops, showStops]);

  // Add this function inside the component
  const toggleStopMarkers = () => {
    setShowStops(!showStops);
    Object.values(stopMarkers.current).forEach((marker) => {
      if (showStops) {
        marker.remove();
      } else {
        marker.addTo(map.current!);
      }
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-8 w-full gap-4">
        <div
          ref={mapContainer}
          className="col-span-full lg:col-span-6 order-2 lg:order-1 h-[600px] rounded-sm overflow-hidden"
        />
        <div className="col-span-full lg:col-span-2 order-1 lg:order-2 lg:px-4 py-2">
          <MapControls
            operators={operators}
            selectedOperator={selectedOperator}
            onOperatorChange={handleOperatorChange}
            lines={lines}
            selectedLine={selectedLine}
            onLineChange={handleLineChange}
            showStops={showStops}
            onToggleStops={toggleStopMarkers}
            onResetFilter={handleResetFilter}
          />
        </div>
      </div>
      <div className="text-sm text-gray-400 my-4">
        Refreshing in {countdown} seconds
      </div>
    </>
  );
}
