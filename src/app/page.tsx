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
    <div className="flex h-screen w-screen md:items-center md:justify-center md:px-8">
      <div className="flex w-[60rem] flex-col md:justify-center md:py-4">
        {/* Title Bar */}
        <div className="drop-shadow-lg md:pb-2 md:drop-shadow-none">
          <h1 className="font-geist text-md text-primary font-bold">
            San Francisco Live Muni Map
          </h1>
          <p className="text-tiny text-secondary ml-auto">
            Last Updated: Mon 01-01-25
          </p>
        </div>
        {/* Main Content */}
        <div className="h-full">
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
