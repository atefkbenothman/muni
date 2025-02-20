import { VehicleActivity } from "@/types/transit-types";

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <p>
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

export function VehiclePopup({ vehicle }: { vehicle: VehicleActivity }) {
  const journey = vehicle.MonitoredVehicleJourney;

  return (
    <div className="p-3 text-black max-w-[300px]">
      <h3 className="font-bold mb-2">Vehicle Information</h3>
      <div className="flex flex-col space-y-1">
        <InfoItem label="Line" value={journey.LineRef || "N/A"} />
        <InfoItem label="Vehicle ID" value={journey.VehicleRef} />
        <InfoItem label="Direction" value={journey.DirectionRef || "N/A"} />
        <InfoItem
          label="Route Name"
          value={journey.PublishedLineName || "N/A"}
        />
        <InfoItem label="Operator" value={journey.OperatorRef} />
        <InfoItem label="Origin" value={journey.OriginName || "N/A"} />
        <InfoItem
          label="Destination"
          value={journey.DestinationName || "N/A"}
        />
        <InfoItem
          label="Status"
          value={journey.Monitored ? "Monitored" : "Not Monitored"}
        />
        <InfoItem
          label="Congestion"
          value={journey.InCongestion ? "Yes" : "No"}
        />
        <InfoItem label="Occupancy" value={journey.Occupancy || "N/A"} />
        <InfoItem label="Bearing" value={`${journey.Bearing}°`} />
        <div>
          <b>Last Updated:</b>{" "}
          {new Date(vehicle.RecordedAtTime).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
