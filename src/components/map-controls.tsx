import { Operator, TransitLine } from "@/types/transit-types";

type MapControlProps = {
  operators: Operator[];
  selectedOperator: string;
  onOperatorChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  transitLines: TransitLine[];
  selectedLine: string;
  onLineChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  showStops: boolean;
  onToggleStops: () => void;
  onResetFilter: () => void;
};

export const MapControls = ({
  operators,
  selectedOperator,
  onOperatorChange,
  transitLines,
  selectedLine,
  onLineChange,
  showStops,
  onToggleStops,
  onResetFilter,
}: MapControlProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm">Operators</label>
        <select
          value={selectedOperator}
          onChange={onOperatorChange}
          className="w-full border p-1 rounded-sm"
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
          className="w-full border p-1 rounded-sm"
        >
          <option>All</option>
          {transitLines.map((line) => (
            <option key={line.Id} value={line.Id}>
              {line.Name} ({line.PublicCode})
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <label className="text-sm">Show Stops</label>
        <button
          onClick={onToggleStops}
          className={`px-3 py-1 rounded-sm ${
            showStops ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          {showStops ? "On" : "Off"}
        </button>
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
  );
};
