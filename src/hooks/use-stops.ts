import { useCallback, useState } from "react"

import type { TransitStop } from "@/types/transit-types"

import { parseStopRefs } from "@/utils/transit"
import { getPatternsByLine } from "@/actions/muni-actions"

export const useStops = (transitStops: TransitStop[]) => {
  const [routeStops, setRouteStops] = useState<TransitStop[]>([])

  const updateRouteStops = useCallback(async (lineRef: string) => {
    try {
      const patterns = await getPatternsByLine(lineRef)
      const allStopRefs = patterns.flatMap((pattern) =>
        parseStopRefs(pattern.PointsInSequence as string)
      )
      const matchedStops = transitStops.filter((stop) =>
        allStopRefs.includes(stop.id.toString())
      )
      setRouteStops(matchedStops)
    } catch (err) {
      console.error("Error updating route stops:", err)
      setRouteStops([])
    }
  }, [transitStops])

  const clearRouteStops = useCallback(() => {
    setRouteStops([])
  }, [])

  return {
    routeStops,
    updateRouteStops,
    clearRouteStops
  }
}
