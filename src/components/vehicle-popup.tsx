import { VehicleActivity } from "@/types/transit-types";

export function VehiclePopup({ vehicle }: { vehicle: VehicleActivity }) {
  const journey = vehicle.MonitoredVehicleJourney;

  return (
    <div className="p-3 text-black max-w-[300px]">
      <h3 className="font-bold mb-2">Vehicle Information</h3>
      <div className="space-y-1">
        <div>
          <b>Line:</b> {journey.LineRef}
        </div>
        <div>
          <b>Vehicle ID:</b> {journey.VehicleRef}
        </div>
        <div>
          <b>Direction:</b> {journey.DirectionRef || "N/A"}
        </div>
        <div>
          <b>Route Name:</b> {journey.PublishedLineName || "N/A"}
        </div>
        <div>
          <b>Operator:</b> {journey.OperatorRef}
        </div>
        <div>
          <b>Origin:</b> {journey.OriginName || "N/A"}
        </div>
        <div>
          <b>Destination:</b> {journey.DestinationName || "N/A"}
        </div>
        <div>
          <b>Status:</b> {journey.Monitored ? "Monitored" : "Not Monitored"}
        </div>
        <div>
          <b>Congestion:</b> {journey.InCongestion ? "Yes" : "No"}
        </div>
        <div>
          <b>Occupancy:</b> {journey.Occupancy || "N/A"}
        </div>
        <div>
          <b>Bearing:</b> {journey.Bearing}°
        </div>
        <div>
          <b>Last Updated:</b>{" "}
          {new Date(vehicle.RecordedAtTime).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
