import { useState, useEffect, useRef } from "react"
import type { VehicleActivity } from "@/types/transit-types"
import { getVehicleMonitoring } from "@/actions/muni-actions"

export const useRealtimeVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleActivity[]>([])

  const fetchVehicles = async () => {
    try {
      const data = await getVehicleMonitoring()
      setVehicles(data)
    } catch (error) {
      console.error("Error fetching vehicle data:", error)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  return { vehicles }
}
