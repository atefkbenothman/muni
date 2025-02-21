"use client"

import { useState, useCallback, useMemo } from "react"

import "mapbox-gl/dist/mapbox-gl.css"

import type { TransitLine, TransitStop, TransitOperator } from "@/types/transit-types"
import type { PopupInfo } from "@/components/map"

import { filterVehiclesByLine, filterVehiclesByMode, parseStopRefs } from "@/utils/transit"

import { Controls } from "@/components/controls"
import { Map } from "@/components/map"
import { Countdown } from "@/components/countdown"

import { useRealtimeVehicles } from "@/hooks/use-vehicles"
import { useTransitData } from "@/hooks/use-transit"
import { getPatternsByLine } from "@/actions/muni-actions"

/* Globals */
const REFRESH_INTERVAL = 600
const DEFAULT_AGENCY = "SF"

type ContentProps = {
  transitLines: TransitLine[]
  transitStops: TransitStop[]
  transitOperators: TransitOperator[]
}

export function Dashboard({ transitLines, transitStops, transitOperators }: ContentProps) {
  const { vehicles } = useRealtimeVehicles(REFRESH_INTERVAL)

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
  } = useTransitData(DEFAULT_AGENCY)

  const [showStops, setShowStops] = useState(true)
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null)

  const [routeStops, setRouteStops] = useState<TransitStop[]>([])

  const filteredVehicles = useMemo(() => {
    let filtered = filterVehiclesByLine(vehicles, selectedLine, transitLines)
    return filterVehiclesByMode(filtered, transitLines, { showBuses, showMetro, showCableway })
  }, [vehicles, selectedLine, transitLines, showBuses, showMetro, showCableway])

  const handleOperatorChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedOperator(e.target.value)
    },
    [],
  )

  const handleLineChange = useCallback(
    async (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedLine(e.target.value)
      const patterns = await getPatternsByLine(e.target.value)
      const allStopRefs = patterns.flatMap((pattern) =>
        parseStopRefs(pattern.PointsInSequence as string),
      )
      const matchedStops = transitStops.filter((stop) =>
        allStopRefs.includes(stop.id.toString()),
      )
      setRouteStops(matchedStops)
    },
    [],
  )

  const handleMarkerClick = useCallback(async (lineRef: string) => {
    setSelectedLine(lineRef)
    setShowStops(true)
    const patterns = await getPatternsByLine(lineRef)
    const allStopRefs = patterns.flatMap((pattern) =>
      parseStopRefs(pattern.PointsInSequence as string),
    )
    const matchedStops = transitStops.filter((stop) =>
      allStopRefs.includes(stop.id.toString()),
    )
    setRouteStops(matchedStops)
  }, [])

  const handleResetFilter = useCallback(() => {
    setSelectedLine("All")
    setRouteStops([])
  }, [])

  const toggleStopMarkers = useCallback(() => {
    setShowStops((prev) => !prev)
  }, [])

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
            lines={transitLines}
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
      <Countdown refreshInterval={REFRESH_INTERVAL} />
    </>
  )
}
