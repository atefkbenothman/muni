"use client";

import { useRef, useEffect, useState } from "react";
import { MapControls } from "@/components/map-controls";
import type {
  VehicleActivity,
  Operator,
  TransitLine,
} from "@/types/transit-types";
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
const REFRESH_INTERVAL = 60;
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

const createVehicleMarker = (vehicle: VehicleActivity) => {
  const { MonitoredVehicleJourney: journey } = vehicle;
  if (!journey.LineRef) return null;

  return new mapboxgl.Marker(createMarkerElement())
    .setLngLat([
      Number.parseFloat(journey.VehicleLocation.Longitude),
      Number.parseFloat(journey.VehicleLocation.Latitude),
    ])
    .setPopup(
      new mapboxgl.Popup({ maxWidth: "350px" }).setHTML(
        createPopupMarker(vehicle)
      )
    );
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

const filterVehiclesByLine = (
  vehicles: VehicleActivity[],
  selectedLine: string,
  transitLines: TransitLine[]
): VehicleActivity[] => {
  if (!selectedLine || selectedLine === "All") return vehicles;
  return vehicles.filter((vehicle) => {
    const lineRef = vehicle.MonitoredVehicleJourney.LineRef;
    const matchingLine = transitLines.find((line) => line.Id === selectedLine);
    return lineRef === matchingLine?.SiriLineRef;
  });
};

export function MuniMap() {
  const {
    operators,
    selectedOperator,
    setSelectedOperator,
    transitLines,
    selectedLine,
    setSelectedLine,
  } = useTransitData(DEFAULT_AGENCY);
  const { vehicles, countdown } = useRealtimeVehicles(REFRESH_INTERVAL);

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});

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

    Object.values(markers.current).forEach((marker) => marker.remove());
    markers.current = {};

    const filteredVehicles = filterVehiclesByLine(
      vehicles,
      selectedLine,
      transitLines
    );

    filteredVehicles.forEach((vehicle) => {
      const marker = createVehicleMarker(vehicle);
      if (marker) {
        marker.addTo(map.current!);
        markers.current[vehicle.MonitoredVehicleJourney.VehicleRef] = marker;
      }
    });
  }, [vehicles, selectedLine, transitLines]);

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperator(e.target.value);
  };

  const handleLineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLine(e.target.value);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-8 w-full gap-4">
        <div
          ref={mapContainer}
          className="col-span-full lg:col-span-6 order-2 lg:order-1 h-[600px] rounded-sm overflow-hidden"
        />
        <div className="col-span-full lg:col-span-2 order-1 lg:order-2 lg:px-4">
          <MapControls
            operators={operators}
            selectedOperator={selectedOperator}
            onOperatorChange={handleOperatorChange}
            transitLines={transitLines}
            selectedLine={selectedLine}
            onLineChange={handleLineChange}
          />
        </div>
      </div>
      <div className="text-sm text-gray-400 my-4">
        Refreshing in {countdown} seconds
      </div>
    </>
  );
}
