import type { TransitStop } from "@/types/transit-types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

type StopCardProps = {
  stop: TransitStop
  onClose: () => void
}

export function StopCard({ stop, onClose }: StopCardProps) {
  return (
    <Card className="absolute top-2 right-2 z-10 w-64 rounded-xs py-4 opacity-90 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-0">
        <CardTitle className="flex flex-row items-center gap-4 text-sm font-medium">
          <div className="rounded-xl bg-white px-2.5 py-1 text-black">
            {stop.id}
          </div>
          <div className="flex flex-row text-balance">
            📍 {stop.Name || "Unknown Stop"}
          </div>
        </CardTitle>
        <X className="h-4 w-4 cursor-pointer" onClick={onClose} />
      </CardHeader>
      <CardContent className="px-4 py-0">
        <div className="text-secondary space-y-1 text-xs">
          <div className="space-y-2">
            <p>
              <span className="font-medium">Stop ID: </span>
              <span className="text-white/90">{stop.id}</span>
            </p>

            <p>
              <span className="font-medium">Type: </span>
              <span className="text-white/90">{stop.StopType || "N/A"}</span>
            </p>

            {stop["Extensions/PlatformCode"] && (
              <p>
                <span className="font-medium">Platform: </span>
                <span className="text-white/90">
                  {stop["Extensions/PlatformCode"]}
                </span>
              </p>
            )}

            <p>
              <span className="font-medium">Location: </span>
              <span className="text-white/90">
                {stop["Location/Latitude"]?.toFixed(6)},{" "}
                {stop["Location/Longitude"]?.toFixed(6)}
              </span>
            </p>

            {stop["Extensions/ValidBetween/FromDate"] && (
              <p>
                <span className="font-medium">Valid From: </span>
                <span className="text-white/90">
                  {new Date(
                    stop["Extensions/ValidBetween/FromDate"],
                  ).toLocaleDateString()}
                </span>
              </p>
            )}

            {stop["Extensions/ValidBetween/ToDate"] && (
              <p>
                <span className="font-medium">Valid Until: </span>
                <span className="text-white/90">
                  {new Date(
                    stop["Extensions/ValidBetween/ToDate"],
                  ).toLocaleDateString()}
                </span>
              </p>
            )}

            {stop.Url && (
              <p>
                <span className="font-medium">More Info: </span>
                <a
                  href={stop.Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Link
                </a>
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
