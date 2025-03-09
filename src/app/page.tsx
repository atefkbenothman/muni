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
        <div className="flex items-center justify-between px-2 py-2 drop-shadow-lg md:px-0 md:py-0 md:pb-2 md:drop-shadow-none">
          <h1 className="font-geist text-md text-primary font-bold">
            San Francisco Live Muni Map
            <p className="text-tiny text-secondary">
              Last Updated: Mon 01-01-25
            </p>
          </h1>
          <div className="mr-2 md:hidden">
            <p className="text-secondary text-sm">
              Made by{" "}
              <a
                href="https://kaib.vercel.app/"
                className="underline underline-offset-4"
                target="_blank"
              >
                Kai
              </a>
            </p>
          </div>
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
      <div className="text-secondary absolute top-2 hidden w-full py-2 text-center text-sm md:block">
        Made by{" "}
        <a
          href="https://kaib.vercel.app/"
          className="underline underline-offset-4"
          target="_blank"
        >
          Kai
        </a>
      </div>
    </div>
  )
}
