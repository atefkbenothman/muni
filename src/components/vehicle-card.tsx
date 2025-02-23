import type { TransitLine, VehicleActivity } from "@/types/transit-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

type InfoCardProps = {
  data: {
    vehicleActivity: VehicleActivity
    line: TransitLine | undefined
  }
  onClose: () => void
}

export function VehicleCard({ data, onClose }: InfoCardProps) {
  return (
    <Card className="absolute top-2 right-2 z-10 w-64 rounded-xs py-4 opacity-90 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-0">
        <CardTitle className="flex flex-row items-center gap-4 text-sm font-medium">
          <div className="rounded-xl bg-white px-2.5 py-1 text-black">
            {data.line?.Id}
          </div>
          <div className="flex flex-row text-balance">
            {data.line?.TransportMode === "bus" ? "🚌" : "🚊"}{" "}
            {data.line?.Name || data.line?.PublicCode}
          </div>
        </CardTitle>
        <X className="h-4 w-4 cursor-pointer" onClick={onClose} />
      </CardHeader>
      <CardContent className="px-4 py-0">
        <div className="text-secondary space-y-1 text-xs">
          <div className="space-y-2">
            <p>
              <span className="font-medium">ID: </span>
              <span className="text-white/90">{data.line?.Id}</span>
            </p>

            <p>
              <span className="font-medium">Operator: </span>
              <span className="text-white/90">
                {data.vehicleActivity.MonitoredVehicleJourney.OperatorRef ||
                  "N/A"}
              </span>
            </p>

            <p>
              <span className="font-medium">Line: </span>
              <span className="text-white/90">
                {data.vehicleActivity.MonitoredVehicleJourney.LineRef || "N/A"}
              </span>
            </p>

            <p>
              <span className="font-medium">From: </span>
              <span className="text-white/90">
                {data.vehicleActivity.MonitoredVehicleJourney.OriginName ||
                  "N/A"}
              </span>
            </p>

            <p>
              <span className="font-medium">To: </span>
              <span className="text-white/90">
                {data.vehicleActivity.MonitoredVehicleJourney.DestinationName ||
                  "N/A"}
              </span>
            </p>

            <p>
              <span className="font-medium">Direction: </span>
              <span className="text-white/90">
                {data.vehicleActivity.MonitoredVehicleJourney.DirectionRef ||
                  "N/A"}
              </span>
            </p>

            <p>
              <span className="font-medium">Congestion: </span>
              <span className="text-white/90">
                {data.vehicleActivity.MonitoredVehicleJourney.InCongestion
                  ? "Yes"
                  : "No"}
              </span>
            </p>

            <p>
              <span className="font-medium">Valid Until: </span>
              <span className="text-white/90">
                {data.vehicleActivity.ValidUntilTime || "N/A"}
              </span>
            </p>

            <p>
              <span className="font-medium">Last Updated: </span>
              <span className="text-white/90">
                {new Date(
                  data.vehicleActivity.RecordedAtTime,
                ).toLocaleString() || "N/A"}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
