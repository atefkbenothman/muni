"use server"
import { getTransitLines, getTransitOperators, getTransitStops } from "@/actions/muni-actions"

import { Dashboard } from "@/components/dashboard"

export default async function Home() {
  const transitLines = await getTransitLines()
  const transitStops = await getTransitStops()
  const transitOperators = await getTransitOperators()

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <div className="w-full p-6">
        <h1 className="text-center text-lg font-semibold">
          San Francisco Muni Map
        </h1>
      </div>
      <Dashboard
        transitLines={transitLines}
        transitStops={transitStops}
        transitOperators={transitOperators}
      />
    </div>
  )
}
