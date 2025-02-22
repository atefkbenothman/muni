import type { TransitLine, VehicleActivity } from "@/types/transit-types"
import { Badge } from "@/components/ui/badge"
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
    <Card className="absolute bottom-4 left-4 z-10 w-64 rounded-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {data.line?.TransportMode === "bus" ? "🚌" : "🚊"}{" "}
          {data.line?.Name || data.line?.PublicCode}
        </CardTitle>
        <Badge
          variant={data.line?.Monitored ? "default" : "secondary"}
          className="rounded-sm"
        >
          {data.line?.Monitored ? "Monitored" : "Unmonitored"}
        </Badge>
        <X className="h-4 w-4 cursor-pointer" onClick={onClose} />
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground space-y-1 text-xs">
          <p>ID: {data.line?.Id}</p>
          <p>
            Operator:{" "}
            {data.vehicleActivity.MonitoredVehicleJourney.OperatorRef || "N/A"}
          </p>
          <p>
            Line:{" "}
            {data.vehicleActivity.MonitoredVehicleJourney.LineRef || "N/A"}
          </p>
          <p>
            From:{" "}
            {data.vehicleActivity.MonitoredVehicleJourney.OriginName || "N/A"}
          </p>
          <p>
            To:{" "}
            {data.vehicleActivity.MonitoredVehicleJourney.DestinationName ||
              "N/A"}
          </p>
          <p>
            Direction:{" "}
            {data.vehicleActivity.MonitoredVehicleJourney.DirectionRef || "N/A"}
          </p>
          <p>
            Congestion:{" "}
            {data.vehicleActivity.MonitoredVehicleJourney.InCongestion
              ? "Yes"
              : "No"}
          </p>
          <p>Valid Until: {data.vehicleActivity.ValidUntilTime || "N/A"}</p>
          <p>
            Last Updated:{" "}
            {new Date(data.vehicleActivity.RecordedAtTime).toLocaleString() ||
              "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
