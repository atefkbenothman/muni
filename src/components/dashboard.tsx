"use client"

import { useState, useCallback, useMemo } from "react"

import "mapbox-gl/dist/mapbox-gl.css"

import type { TransitLine, TransitStop, TransitOperator } from "@/types/transit-types"
import type { PopupInfo } from "@/components/map"

import { filterVehiclesByLine, filterVehiclesByMode } from "@/utils/transit"

import { Controls } from "@/components/controls"
import { Map } from "@/components/map"
import { Countdown } from "@/components/countdown"

import { useRealtimeVehicles } from "@/hooks/use-vehicles"
import { useStops } from "@/hooks/use-stops"
import { useFilters, type TransitModes } from "@/hooks/use-filters"

/* Globals */
const REFRESH_INTERVAL = 600

type ContentProps = {
  transitLines: TransitLine[]
  transitStops: TransitStop[]
  transitOperators: TransitOperator[]
}

export function Dashboard({ transitLines, transitStops, transitOperators }: ContentProps) {
  const { vehicles } = useRealtimeVehicles(REFRESH_INTERVAL)
  const { filters, selectOperator, selectLine, toggleTransitMode, toggleStops, resetFilters } = useFilters()
  const { routeStops, clearRouteStops, updateRouteStops } = useStops(transitStops)

  const selectedLine = filters.selectedLine
  const selectedOperator = filters.selectedOperator

  const showStops = filters.showStops
  const showBuses = filters.visibleModes.buses
  const showMetro = filters.visibleModes.metro
  const showCableway = filters.visibleModes.cableway

  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null)

  const filteredVehicles = useMemo(() => {
    let filtered = filterVehiclesByLine(vehicles, selectedLine, transitLines)
    return filterVehiclesByMode(filtered, transitLines, { showBuses, showMetro, showCableway })
  }, [vehicles, selectedLine, transitLines, showBuses, showMetro, showCableway])

  const handleOperatorChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    selectOperator(e.target.value)
  }, [])

  const handleLineChange = useCallback(async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lineId = e.target.value

    selectLine(lineId)

    if (lineId === "All" ) {
      clearRouteStops()
    } else {
      await updateRouteStops(lineId)
    }

  }, [])

  const handleMarkerClick = useCallback(async (lineRef: string) => {
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
  const handleToggleCableway = useCallback(() => toggleTransitMode("cableway"), [])

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-8">
        <div className="order-2 col-span-full h-[600px] overflow-hidden rounded-sm lg:order-1 lg:col-span-6">
          <Map
            filteredVehicles={filteredVehicles}
            showStops={showStops}
            stops={routeStops}
            popupInfo={popupInfo}
            setPopupInfo={setPopupInfo}
            handleMarkerClick={handleMarkerClick}
            lines={transitLines}
          />
        </div>
        <div className="order-1 col-span-full py-2 lg:order-2 lg:col-span-2 lg:px-4">
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
      <Countdown refreshInterval={REFRESH_INTERVAL} />
    </>
  )
}
