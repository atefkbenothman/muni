import type { Directions, VehicleActivity } from "@/types/transit-types"
import type { TransitLine } from "@/types/transit-types"

export const filterVehiclesByLine = (vehicles: VehicleActivity[], selectedLine: string, transitLines: TransitLine[]): VehicleActivity[] => {
  if (!selectedLine || selectedLine === "All") return vehicles
  const matchingLine = transitLines.find(
    (line) => line.Id === selectedLine || line.SiriLineRef === selectedLine,
  )
  return vehicles.filter((vehicle) => {
    const lineRef = vehicle.MonitoredVehicleJourney.LineRef
    return lineRef === matchingLine?.SiriLineRef || lineRef === selectedLine
  })
}

type FilterVehiclesByModeProps = {
  vehicles: VehicleActivity[]
  lines: TransitLine[]
  direction: Directions
  modes: {
    showBuses: boolean
    showMetro: boolean
    showCableway: boolean
  }
}

export const filterVehiclesByMode = (vehicles: VehicleActivity[], lines: TransitLine[], direction: Directions, modes: { showBuses: boolean; showMetro: boolean; showCableway: boolean; }): VehicleActivity[] => {
  return vehicles.filter((vehicle) => {
    const lineRef = vehicle.MonitoredVehicleJourney.LineRef
    const line = lines.find((line) => line.Id === lineRef || line.SiriLineRef === lineRef)
    if (!line) return false
    if (direction && vehicle.MonitoredVehicleJourney.DirectionRef !== direction && direction !== "BOTH") return false
    switch (line.TransportMode?.toLowerCase()) {
      case "bus":
        return modes.showBuses
      case "metro":
        return modes.showMetro
      case "cableway":
        return modes.showCableway
      default:
        return true
    }
  })
}

export const parseStopRefs = (pointsInSequence: string | null): string[] => {
  if (!pointsInSequence) return []
  const cleanedPoints = pointsInSequence.replace(
    /(^|[{,\s])'([^']*)'/g,
    '$1"$2"',
  )
  try {
    const parsed = JSON.parse(cleanedPoints)
    return parsed.StopPointInJourneyPattern.map(
      (stop: any) => stop.ScheduledStopPointRef,
    )
  } catch (err) {
    console.error("Error parsing stop refs:", err)
    return []
  }
}
