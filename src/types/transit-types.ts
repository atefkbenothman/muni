import type { Tables } from "@/types/database.types"

export type TransitLine = Tables<"lines">
export type TransitStop = Tables<"stops">
export type TransitOperator = Tables<"operators">
export type VehicleMonitoring = Tables<"vehicle_monitoring">

export type VehicleActivity = {
  RecordedAtTime: string
  ValidUntilTime: string
  MonitoredVehicleJourney: {
    LineRef: string | null
    DirectionRef: string | null
    FramedVehicleJourneyRef: {
      DataFrameRef: string
      DatedVehicleJourneyRef: string | null
    }
    PublishedLineName: string | null
    OperatorRef: string
    OriginRef: string | null
    OriginName: string | null
    DestinationRef: string | null
    DestinationName: string | null
    Monitored: boolean
    InCongestion: boolean | null
    VehicleLocation: {
      Longitude: string
      Latitude: string
    }
    Bearing: string
    Occupancy: string
    VehicleRef: string
  }
}

export type Directions = "BOTH" | "IB" | "OB" | "N" | "S"
