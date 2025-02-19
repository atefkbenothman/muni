import { Operator, TransitLine } from "@/types/transit-types";

type MapControlProps = {
  operators: Operator[];
  selectedOperator: string;
  onOperatorChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  transitLines: TransitLine[];
  selectedLine: string;
  onLineChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  countdown: number;
};

export const MapControls = ({
  operators,
  selectedOperator,
  onOperatorChange,
  transitLines,
  selectedLine,
  onLineChange,
  countdown,
}: MapControlProps) => {
  return (
    <div className="flex flex-col items-center space-y-4 mb-4">
      <div className="flex items-center space-x-4">
        <select
          value={selectedOperator}
          onChange={onOperatorChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {operators.map((operator) => (
            <option key={operator.Id} value={operator.Id}>
              {operator.Name}
            </option>
          ))}
        </select>
        <select
          value={selectedLine}
          onChange={onLineChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a line</option>
          {transitLines.map((line) => (
            <option key={line.Id} value={line.Id}>
              {line.Name} ({line.PublicCode})
            </option>
          ))}
        </select>
        <div className="text-sm text-gray-600">
          Refreshing in {countdown} seconds
        </div>
      </div>
    </div>
  );
};
