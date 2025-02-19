import { useRealtimeVehicles } from "@/hooks/use-vehicles";

const REFRESH_INTERVAL = 600;

export function Countdown() {
  const { countdown } = useRealtimeVehicles(REFRESH_INTERVAL);

  return (
    <div className="text-sm text-gray-400 my-4">
      Refreshing in {countdown} seconds
    </div>
  );
}
