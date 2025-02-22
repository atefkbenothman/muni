"use server"
import {
  getTransitLines,
  getTransitOperators,
  getTransitStops,
} from "@/actions/muni-actions"

import { Dashboard } from "@/components/dashboard"

export default async function Home() {
  const transitLines = await getTransitLines()
  const transitStops = await getTransitStops()
  const transitOperators = await getTransitOperators()

  return (
    <div className="flex h-screen flex-col p-4">
      <h1 className="font-geist pb-2 font-bold">San Francisco Muni Map</h1>
      <div className="relative h-full flex-1">
        <Dashboard
          transitLines={transitLines}
          transitStops={transitStops}
          transitOperators={transitOperators}
        />
      </div>
    </div>
  )
}
