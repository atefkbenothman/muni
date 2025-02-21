import { useState, useEffect, useRef } from "react"
import type { VehicleActivity } from "@/types/transit-types"
import { getVehicleMonitoring } from "@/actions/muni-actions";

export const useRealtimeVehicles = (refreshInterval: number) => {
  const [countdown, setCountdown] = useState<number>(refreshInterval);
  const [vehicles, setVehicles] = useState<VehicleActivity[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchVehicles = async () => {
    try {
      const data = await getVehicleMonitoring();
      setVehicles(data);
      setCountdown(refreshInterval)
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchVehicles();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refreshInterval])

  return { vehicles, countdown }
}
