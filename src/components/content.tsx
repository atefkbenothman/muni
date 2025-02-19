"use client";

import { useState, useCallback, useMemo } from "react";
import { MapControls } from "@/components/map-controls";
import type { VehicleActivity } from "@/types/transit-types";
import { MuniMap } from "@/components/muni-map";
import "mapbox-gl/dist/mapbox-gl.css";
import { useRealtimeVehicles } from "@/hooks/use-vehicles";
import { useTransitData } from "@/hooks/use-transit";
import { PopupInfo } from "@/components/muni-map";
import { Tables } from "@/types/database.types";
import { Countdown } from "@/components/countdown";

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

type ContentProps = {
  lines: Tables<"lines">[];
  stops: Tables<"stops">[];
  operators: Tables<"operators">[];
};

export function Content({ lines, stops, operators }: ContentProps) {
  const { vehicles } = useRealtimeVehicles(REFRESH_INTERVAL);

  const {
    selectedOperator,
    setSelectedOperator,
    selectedLine,
    setSelectedLine,
  } = useTransitData(DEFAULT_AGENCY);

  const [showStops, setShowStops] = useState(false);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const filteredVehicles = useMemo(() => {
    return filterVehiclesByLine(vehicles, selectedLine, lines);
  }, [vehicles, selectedLine, lines]);

  const handleOperatorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOperator(e.target.value);
    },
    []
  );

  const handleLineChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedLine(e.target.value);
    },
    []
  );

  const handleMarkerClick = useCallback((lineRef: string) => {
    setSelectedLine(lineRef);
  }, []);

  const handleResetFilter = useCallback(() => {
    setSelectedLine("All");
  }, []);

  const toggleStopMarkers = useCallback(() => {
    setShowStops((prev) => !prev);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-8 w-full gap-4">
        <div className="col-span-full lg:col-span-6 order-2 lg:order-1 h-[600px] rounded-sm overflow-hidden">
          <MuniMap
            filteredVehicles={filteredVehicles}
            showStops={showStops}
            stops={stops}
            popupInfo={popupInfo}
            setPopupInfo={setPopupInfo}
            handleMarkerClick={handleMarkerClick}
          />
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
      <Countdown />
    </>
  );
}
