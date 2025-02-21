import { memo } from "react"
import type { TransitLine, TransitOperator } from "@/types/transit-types"

type ControlsProp = {
  operators: TransitOperator[]
  selectedOperator: string
  onOperatorChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  lines: TransitLine[]
  selectedLine: string
  onLineChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  showStops: boolean
  onToggleStops: () => void
  onResetFilter: () => void
  showBuses: boolean
  showMetro: boolean
  showCableway: boolean
  onToggleBuses: () => void
  onToggleMetro: () => void
  onToggleCableway: () => void
}

export const Controls = memo(
  ({
    operators,
    selectedOperator,
    onOperatorChange,
    lines,
    selectedLine,
    onLineChange,
    showStops,
    onToggleStops,
    onResetFilter,
    showBuses,
    showMetro,
    showCableway,
    onToggleBuses,
    onToggleMetro,
    onToggleCableway,
  }: ControlsProp) => {
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm">Operators</label>
          <select
            value={selectedOperator}
            onChange={onOperatorChange}
            className="w-full rounded-sm border p-1"
          >
            {operators.map((operator) => (
              <option key={operator.Id} value={operator.Id}>
                {operator.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm">Lines</label>
          <select
            value={selectedLine}
            onChange={onLineChange}
            className="w-full rounded-sm border p-1"
          >
            <option>All</option>
            {lines.map((line) => (
              <option key={line.Id} value={line.Id}>
                {line.Name} ({line.PublicCode})
              </option>
            ))}
          </select>
        </div>
        {/* Toggle Controls Section */}
        <div className="flex flex-col space-y-3 pt-2">
          <h3 className="text-sm font-medium">Display Options</h3>

          {/* Stops Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm">Show Stops</label>
            <button
              onClick={onToggleStops}
              className={`rounded-sm px-3 py-1 ${
                showStops
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {showStops ? "On" : "Off"}
            </button>
          </div>

          {/* Bus Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm">Show Buses 🚎</label>
            <button
              onClick={onToggleBuses}
              className={`rounded-sm px-3 py-1 ${
                showBuses
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {showBuses ? "On" : "Off"}
            </button>
          </div>

          {/* Metro Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm">Show Metro 🚃</label>
            <button
              onClick={onToggleMetro}
              className={`rounded-sm px-3 py-1 ${
                showMetro
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {showMetro ? "On" : "Off"}
            </button>
          </div>

          {/* Cableway Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm">Show Cableway 🚋</label>
            <button
              onClick={onToggleCableway}
              className={`rounded-sm px-3 py-1 ${
                showCableway
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              {showCableway ? "On" : "Off"}
            </button>
          </div>
        </div>

        <div>
          <button
            onClick={onResetFilter}
            className="rounded-sm bg-gray-300 px-3 py-1 text-black"
            title="Reset line filter"
          >
            Reset Filter
          </button>
        </div>
      </div>
    )
  },
)
