"use client";

import { useState, useCallback, useMemo } from "react";

import "mapbox-gl/dist/mapbox-gl.css";

import type { VehicleActivity } from "@/types/transit-types";
import type { Tables } from "@/types/database.types";
import type { PopupInfo } from "@/components/muni-map";

import { MapControls } from "@/components/map-controls";
import { MuniMap } from "@/components/muni-map";
import { Countdown } from "@/components/countdown";

import { useRealtimeVehicles } from "@/hooks/use-vehicles";
import { useTransitData } from "@/hooks/use-transit";
import { getPatternsByLine } from "@/actions/muni-actions";

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

const parseStopRefs = (pointsInSequence: string | null): string[] => {
  if (!pointsInSequence) return [];
  const cleanedPoints = pointsInSequence.replace(
    /(^|[{,\s])'([^']*)'/g,
    '$1"$2"'
  );
  try {
    const parsed = JSON.parse(cleanedPoints);
    return parsed.StopPointInJourneyPattern.map(
      (stop: any) => stop.ScheduledStopPointRef
    );
  } catch (err) {
    console.log(cleanedPoints);
    console.error("Error parsing stop refs:", err);
    return [];
  }
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
    showBuses,
    setShowBuses,
    showMetro,
    setShowMetro,
    showCableway,
    setShowCableway,
  } = useTransitData(DEFAULT_AGENCY);

  const [showStops, setShowStops] = useState(true);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);

  const [routeStops, setRouteStops] = useState<Tables<"stops">[]>([]);

  const filteredVehicles = useMemo(() => {
    let filtered = filterVehiclesByLine(vehicles, selectedLine, lines);

    // Filter by transport mode
    filtered = filtered.filter((vehicle) => {
      const lineRef = vehicle.MonitoredVehicleJourney.LineRef;
      const line = lines.find(
        (l) => l.Id === lineRef || l.SiriLineRef === lineRef
      );

      if (!line) return false;

      switch (line.TransportMode?.toLowerCase()) {
        case "bus":
          return showBuses;
        case "metro":
          return showMetro;
        case "cableway":
          return showCableway;
        default:
          return true;
      }
    });

    return filtered;
  }, [vehicles, selectedLine, lines, showBuses, showMetro, showCableway]);

  const handleOperatorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOperator(e.target.value);
    },
    []
  );

  const handleLineChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedLine(e.target.value);
      const patterns = await getPatternsByLine(e.target.value);
      const allStopRefs = patterns.flatMap((pattern) =>
        parseStopRefs(pattern.PointsInSequence as string)
      );
      const matchedStops = stops.filter((stop) =>
        allStopRefs.includes(stop.id.toString())
      );
      setRouteStops(matchedStops);
    },
    []
  );

  const handleMarkerClick = useCallback(async (lineRef: string) => {
    setSelectedLine(lineRef);
    setShowStops(true);
    const patterns = await getPatternsByLine(lineRef);
    const allStopRefs = patterns.flatMap((pattern) =>
      parseStopRefs(pattern.PointsInSequence as string)
    );
    const matchedStops = stops.filter((stop) =>
      allStopRefs.includes(stop.id.toString())
    );
    setRouteStops(matchedStops);
  }, []);

  const handleResetFilter = useCallback(() => {
    setSelectedLine("All");
    setRouteStops([]);
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
            stops={routeStops}
            popupInfo={popupInfo}
            setPopupInfo={setPopupInfo}
            handleMarkerClick={handleMarkerClick}
            lines={lines}
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
            showBuses={showBuses}
            showMetro={showMetro}
            showCableway={showCableway}
            onToggleBuses={() => setShowBuses((prev) => !prev)}
            onToggleMetro={() => setShowMetro((prev) => !prev)}
            onToggleCableway={() => setShowCableway((prev) => !prev)}
          />
        </div>
      </div>
      <Countdown />
    </>
  );
}
