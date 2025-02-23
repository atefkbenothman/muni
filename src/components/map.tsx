"use client"

import { memo, useMemo } from "react"
import { NavigationControl, Map as ReactMap } from "react-map-gl/mapbox"
import { Marker } from "react-map-gl/mapbox"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import type {
  VehicleActivity,
  TransitStop,
  TransitLine,
} from "@/types/transit-types"

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

const bounds: [number, number, number, number] = [
  -122.66336,
  37.492987, // Southwest coordinates
  -122.250481,
  37.871651, // Northeast coordinates
]

const icons = {
  bus: "🚌",
  metro: "🚃",
  cableway: "🚋",
}

export type PopupInfo = {
  type: "vehicle" | "stop"
  data: VehicleActivity | TransitStop
  latitude: number
  longitude: number
}

type MapProps = {
  filteredVehicles: VehicleActivity[]
  showStops: boolean
  lines: TransitLine[]
  stops: TransitStop[]
  handleMarkerClick: (vehicle: VehicleActivity) => void
}

const VehicleMarkers = memo(
  ({
    vehicles,
    lines,
    handleMarkerClick,
  }: {
    vehicles: VehicleActivity[]
    lines: TransitLine[]
    handleMarkerClick: (vehicle: VehicleActivity) => void
  }) => {
    return (
      <>
        {vehicles.map((vehicle, idx) => {
          const lineRef = vehicle.MonitoredVehicleJourney.LineRef
          if (!lineRef) return null

          const transportMode = lines.find(
            (line) => line.Id === lineRef,
          )?.TransportMode

          const vehicleEmoji = transportMode
            ? icons[transportMode as keyof typeof icons]
            : "🚗"

          return (
            <Marker
              key={idx}
              longitude={Number(
                vehicle.MonitoredVehicleJourney.VehicleLocation.Longitude,
              )}
              latitude={Number(
                vehicle.MonitoredVehicleJourney.VehicleLocation.Latitude,
              )}
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                handleMarkerClick(vehicle)
              }}
              style={{ zIndex: 2 }}
            >
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer text-xl">{vehicleEmoji}</div>
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-black text-sm font-bold text-white"
                    side="top"
                  >
                    <p>{lineRef}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Marker>
          )
        })}
      </>
    )
  },
)

const StopMarkers = memo(({ stops }: { stops: TransitStop[] }) => {
  return (
    <>
      {stops.map((stop) => (
        <Marker
          key={stop.id}
          longitude={Number(stop["Location/Longitude"])}
          latitude={Number(stop["Location/Latitude"])}
          style={{ zIndex: 1 }}
        >
          <div className="cursor-pointer text-xl">📍</div>
        </Marker>
      ))}
    </>
  )
})

export const Map = memo(
  ({
    filteredVehicles,
    showStops,
    stops,
    handleMarkerClick,
    lines,
  }: MapProps) => {
    const memoizedVehicleMarkers = useMemo(
      () => (
        <VehicleMarkers
          vehicles={filteredVehicles}
          lines={lines}
          handleMarkerClick={handleMarkerClick}
        />
      ),
      [filteredVehicles, lines, handleMarkerClick],
    )

    const memoizedStopMarkers = useMemo(
      () => <StopMarkers stops={stops} />,
      [stops],
    )

    return (
      <ReactMap
        reuseMaps
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: -122.4194,
          latitude: 37.7749,
          zoom: 12,
        }}
        minZoom={8}
        mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "4px",
          border: "2px solid lightgray",
        }}
        maxBounds={bounds}
      >
        <NavigationControl position="top-left" />
        {memoizedVehicleMarkers}
        {showStops && memoizedStopMarkers}
      </ReactMap>
    )
  },
)
