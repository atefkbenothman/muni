import { Tables } from "@/types/database.types";

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactElement;
}) => (
  <p>
    <span className="font-semibold">{label}:</span> {value}
  </p>
);

export function StopPopup({ stop }: { stop: Tables<"stops"> }) {
  return (
    <div className="p-3 text-black max-w-[250px]">
      <h3 className="font-bold mb-2">Stop Information</h3>
      <div className="space-y-1">
        <InfoItem label="Name" value={stop.Name || "N/A"} />
        <InfoItem label="Stop ID" value={String(stop.id) || "N/A"} />
        <InfoItem label="Type" value={stop.StopType || "N/A"} />
        {stop["Extensions/PlatformCode"] && (
          <InfoItem label="Platform" value={stop["Extensions/PlatformCode"]} />
        )}
        {stop.Url && (
          <div>
            <a
              href={stop.Url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              More Info
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
