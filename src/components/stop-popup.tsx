import { Tables } from "@/types/database.types";

export function StopPopup({ stop }: { stop: Tables<"stops"> }) {
  return (
    <div className="p-3 text-black max-w-[250px]">
      <h3 className="font-bold mb-2">Stop Information</h3>
      <div className="space-y-1">
        <div>
          <b>Name:</b> {stop.Name}
        </div>
        <div>
          <b>Stop ID:</b> {stop.id}
        </div>
        <div>
          <b>Type:</b> {stop.StopType}
        </div>
        {stop["Extensions/PlatformCode"] && (
          <div>
            <b>Platform:</b> {stop["Extensions/PlatformCode"]}
          </div>
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
