"use client";

import { Tables } from "@/types/database.types";

import { useRef, useEffect, useState, useCallback } from "react";
import { MapControls } from "@/components/map-controls";
import type { VehicleActivity } from "@/types/transit-types";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRealtimeVehicles } from "@/hooks/use-vehicles";
import { useTransitData } from "@/hooks/use-transit";
import { StopPopup } from "@/components/stop-popup";
import { VehiclePopup } from "@/components/vehicle-popup";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const REFRESH_INTERVAL = 600;
const DEFAULT_AGENCY = "SF";

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

type PopupInfo = {
  type: "vehicle" | "stop";
  data: VehicleActivity | Tables<"stops">;
  latitude: number;
  longitude: number;
};

type MuniMapProps = {
  lines: Tables<"lines">[];
  stops: Tables<"stops">[];
  operators: Tables<"operators">[];
};

export function MuniMap({ lines, stops, operators }: MuniMapProps) {
  const { vehicles, countdown } = useRealtimeVehicles(REFRESH_INTERVAL);
  const {
    selectedOperator,
    setSelectedOperator,
    selectedLine,
    setSelectedLine,
  } = useTransitData(DEFAULT_AGENCY);

  const [showStops, setShowStops] = useState(false);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const filteredVehicles = filterVehiclesByLine(vehicles, selectedLine, lines);

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

  const toggleStopMarkers = () => {
    setShowStops(!showStops);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-8 w-full gap-4">
        <div className="col-span-full lg:col-span-6 order-2 lg:order-1 h-[600px] rounded-sm overflow-hidden">
          <Map
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: -122.4194,
              latitude: 37.7749,
              zoom: 12,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            style={{ width: "100%", height: "100%" }}
          >
            {filteredVehicles.map((vehicle, idx) => {
              return (
                <Marker
                  key={idx}
                  longitude={Number(
                    vehicle.MonitoredVehicleJourney.VehicleLocation.Longitude
                  )}
                  latitude={Number(
                    vehicle.MonitoredVehicleJourney.VehicleLocation.Latitude
                  )}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setPopupInfo({
                      type: "vehicle",
                      data: vehicle,
                      latitude: Number(
                        vehicle.MonitoredVehicleJourney.VehicleLocation.Latitude
                      ),
                      longitude: Number(
                        vehicle.MonitoredVehicleJourney.VehicleLocation
                          .Longitude
                      ),
                    });
                    if (vehicle.MonitoredVehicleJourney.LineRef) {
                      handleMarkerClick(
                        vehicle.MonitoredVehicleJourney.LineRef
                      );
                    }
                  }}
                >
                  <div className="text-xl cursor-pointer">🚌</div>
                </Marker>
              );
            })}
            {showStops &&
              stops.map((stop) => (
                <Marker
                  key={stop.id}
                  longitude={Number(stop["Location/Longitude"])}
                  latitude={Number(stop["Location/Latitude"])}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    setPopupInfo({
                      type: "stop",
                      data: stop,
                      latitude: Number(stop["Location/Latitude"]),
                      longitude: Number(stop["Location/Longitude"]),
                    });
                  }}
                >
                  <div className="text-xl cursor-pointer">🚏</div>
                </Marker>
              ))}
            {popupInfo && (
              <Popup
                longitude={popupInfo.longitude}
                latitude={popupInfo.latitude}
                onClose={() => setPopupInfo(null)}
                closeButton
                closeOnClick={false}
              >
                {popupInfo.type === "vehicle" ? (
                  <VehiclePopup vehicle={popupInfo.data as VehicleActivity} />
                ) : (
                  <StopPopup stop={popupInfo.data as Tables<"stops">} />
                )}
              </Popup>
            )}
          </Map>
        </div>
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
