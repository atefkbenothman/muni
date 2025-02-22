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
    <div className="flex h-screen w-screen justify-center px-8">
      <div className="flex w-[64rem] flex-col justify-center gap-2">
        {/* Title Bar */}
        <div>
          <h1 className="font-geist text-lg font-bold">
            San Francisco Muni Map
          </h1>
          <p className="ml-auto text-xs text-gray-300">
            last updated: Mon 01-01-25
          </p>
        </div>
        {/* Main Content */}
        <div>
          <Dashboard
            transitLines={transitLines}
            transitStops={transitStops}
            transitOperators={transitOperators}
          />
        </div>
      </div>
    </div>
  )
}
