"use client"

import { useState, useCallback, useMemo } from "react"

import "mapbox-gl/dist/mapbox-gl.css"

import type {
  TransitLine,
  TransitStop,
  TransitOperator,
  VehicleActivity,
} from "@/types/transit-types"

import { filterVehiclesByLine, filterVehiclesByMode } from "@/utils/transit"

import { Controls } from "@/components/controls"
import { Map } from "@/components/map"
import { VehicleCard } from "@/components/vehicle-card"

import { useRealtimeVehicles } from "@/hooks/use-vehicles"
import { useStops } from "@/hooks/use-stops"
import { useFilters } from "@/hooks/use-filters"

/* Globals */
const REFRESH_INTERVAL = 600

type ContentProps = {
  transitLines: TransitLine[]
  transitStops: TransitStop[]
  transitOperators: TransitOperator[]
}

export function Dashboard({
  transitLines,
  transitStops,
  transitOperators,
}: ContentProps) {
  const { vehicles } = useRealtimeVehicles(REFRESH_INTERVAL)
  const {
    filters,
    selectOperator,
    selectLine,
    toggleTransitMode,
    toggleStops,
    resetFilters,
  } = useFilters()
  const { routeStops, clearRouteStops, updateRouteStops } =
    useStops(transitStops)

  const selectedLine = filters.selectedLine
  const selectedOperator = filters.selectedOperator

  const showStops = filters.showStops
  const showBuses = filters.visibleModes.buses
  const showMetro = filters.visibleModes.metro
  const showCableway = filters.visibleModes.cableway

  const filteredVehicles = useMemo(() => {
    let filtered = filterVehiclesByLine(vehicles, selectedLine, transitLines)
    return filterVehiclesByMode(filtered, transitLines, {
      showBuses,
      showMetro,
      showCableway,
    })
  }, [vehicles, selectedLine, transitLines, showBuses, showMetro, showCableway])

  const handleOperatorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      selectOperator(e.target.value)
    },
    [],
  )

  const handleLineChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const lineId = e.target.value

      selectLine(lineId)

      if (lineId === "All") {
        clearRouteStops()
      } else {
        await updateRouteStops(lineId)
      }
    },
    [],
  )

  const [vehicleInfo, setVehicleInfo] = useState<{
    vehicleActivity: VehicleActivity
    line: TransitLine | undefined
  } | null>(null)

  const handleMarkerClick = useCallback(async (vehicle: VehicleActivity) => {
    const lineRef = vehicle.MonitoredVehicleJourney.LineRef
    if (!lineRef) return
    const transitLine = transitLines.find(
      (line) => line.SiriLineRef === lineRef,
    )
    setVehicleInfo({ vehicleActivity: vehicle, line: transitLine })
    selectLine(lineRef)
    toggleStops(true)
    await updateRouteStops(lineRef)
  }, [])

  const handleResetFilter = useCallback(() => {
    resetFilters()
    toggleStops(false)
    clearRouteStops()
  }, [])

  const toggleStopMarkers = useCallback(() => {
    toggleStops(!showStops)
  }, [showStops])

  const handleToggleBuses = useCallback(() => toggleTransitMode("buses"), [])
  const handleToggleMetro = useCallback(() => toggleTransitMode("metro"), [])
  const handleToggleCableway = useCallback(
    () => toggleTransitMode("cableway"),
    [],
  )

  const closeInfoCard = () => {
    setVehicleInfo(null)
    handleResetFilter()
  }

  return (
    <div className="grid w-full grid-cols-10">
      <div className="col-span-7 h-[44rem] overflow-hidden">
        <Map
          filteredVehicles={filteredVehicles}
          showStops={showStops}
          stops={routeStops}
          handleMarkerClick={handleMarkerClick}
          lines={transitLines}
        />
        {vehicleInfo && (
          <VehicleCard data={vehicleInfo} onClose={closeInfoCard} />
        )}{" "}
      </div>
      <div className="col-span-3">
        <div className="h-full space-y-4">
          <Controls
            operators={transitOperators}
            selectedOperator={selectedOperator}
            onOperatorChange={handleOperatorChange}
            transitLines={transitLines}
            selectedLine={selectedLine}
            onLineChange={handleLineChange}
            showStops={showStops}
            onToggleStops={toggleStopMarkers}
            onResetFilter={handleResetFilter}
            showBuses={showBuses}
            showMetro={showMetro}
            showCableway={showCableway}
            onToggleBuses={handleToggleBuses}
            onToggleMetro={handleToggleMetro}
            onToggleCableway={handleToggleCableway}
          />
        </div>
      </div>
    </div>
  )
}
