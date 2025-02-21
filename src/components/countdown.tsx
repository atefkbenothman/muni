import { useRealtimeVehicles } from "@/hooks/use-vehicles"

export function Countdown({ refreshInterval }: { refreshInterval: number }) {
  const { countdown } = useRealtimeVehicles(refreshInterval)
  return (
    <div className="my-4 text-sm text-gray-400">
      Refreshing in {countdown} seconds
    </div>
  )
}
