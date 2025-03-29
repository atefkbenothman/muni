import { useState, useEffect } from "react"
import { RealtimeChannel } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "@/utils/client"
import { VehicleActivity } from "@/types/transit-types";


export function useRealtimeVehicles() {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [vehicles, setVehicles] = useState<VehicleActivity[]>([]);
  const [recordedAt, setRecordedAt] = useState<string | null>()

  useEffect(() => {
    const createSubscription = async () => {
      const supabase = createBrowserSupabaseClient()
      const channel = supabase
        .channel("vehicle_monitoring")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "vehicle_monitoring"
          },
          async (payload) => {
            if (payload.new.id) {
              try {
                const { data, error } = await supabase
                  .from("vehicle_monitoring")
                  .select("*")
                  .eq("id", payload.new.id)
                  .single()

                if (error) {
                  console.error("Error fetching vehicle data:", error)
                  return
                }

                if (data) {
                  setVehicles(data.data as VehicleActivity[])
                  setRecordedAt(new Date(data?.recorded_at as string).toLocaleString())
                }
              } catch (err) {
                console.error("Error in fetch operation:", err)
              }
            }
          }
        )
        .subscribe()

      setChannel(channel)
    }

    createSubscription()

    return () => {
      if (channel) {
        channel.unsubscribe()
      }
    }
  }, [])

  return { vehicles, setVehicles, lastUpdateRealtime: recordedAt }
}
