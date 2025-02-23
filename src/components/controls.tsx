import { memo, useState } from "react"
import type {
  Directions,
  TransitLine,
  TransitOperator,
} from "@/types/transit-types"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"

type ControlsProp = {
  operators: TransitOperator[]
  selectedOperator: string
  onOperatorChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  selectedDirection: Directions
  onDirectionChange: (d: Directions) => void
  transitLines: TransitLine[]
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
    onDirectionChange,
    transitLines,
    selectedLine,
    selectedDirection,
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
    const [linesOpen, setLinesOpen] = useState(false)
    const [directionsOpen, setDirectionsOpen] = useState(false)

    return (
      <div className="flex w-full flex-wrap items-center justify-between gap-4">
        {/* Left side - Selectors group */}
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showStops">Lines:</Label>
            <Popover open={linesOpen} onOpenChange={setLinesOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={linesOpen}
                  className="w-[5rem] justify-between rounded-sm text-xs"
                  size="sm"
                >
                  {transitLines.find((line) => line.Id === selectedLine)?.Id ||
                    "All"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Search line..."
                    className="h-9"
                    onFocus={() => setLinesOpen(true)}
                    onBlur={() => setLinesOpen(false)}
                  />
                  <CommandList>
                    <CommandEmpty>No line found.</CommandEmpty>
                    <CommandGroup>
                      {transitLines.map((line) => (
                        <CommandItem
                          key={line.Id}
                          value={line.Id}
                          onSelect={(currentValue) => {
                            onLineChange({
                              target: { value: currentValue },
                            } as React.ChangeEvent<HTMLSelectElement>)
                            setLinesOpen(false)
                          }}
                        >
                          ({line.PublicCode}) {line.Name}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedLine === line.Id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="direction">Direction:</Label>
            <Popover open={directionsOpen} onOpenChange={setDirectionsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={linesOpen}
                  className="w-[5rem] justify-between rounded-sm text-xs"
                  size="sm"
                >
                  {selectedDirection}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        key="both"
                        onSelect={() => onDirectionChange("BOTH")}
                      >
                        Both
                      </CommandItem>
                      <CommandItem
                        key="inbound"
                        onSelect={() => onDirectionChange("IB")}
                      >
                        Inbound
                      </CommandItem>
                      <CommandItem
                        key="outbound"
                        onSelect={() => onDirectionChange("OB")}
                      >
                        Outbound
                      </CommandItem>
                      <CommandItem
                        key="North"
                        onSelect={() => onDirectionChange("N")}
                      >
                        North
                      </CommandItem>
                      <CommandItem
                        key="South"
                        onSelect={() => onDirectionChange("S")}
                      >
                        South
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Right side - Toggles group */}
        <div className="flex flex-wrap items-center justify-end gap-4">
          {/* Stops Switch */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="showStops">📍 Stops</Label>
              <Switch
                id="showStops"
                checked={showStops}
                onCheckedChange={onToggleStops}
              />
            </div>
            {/* Buses Switch */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="showBuses">🚌 Buses</Label>
              <Switch
                id="showBuses"
                checked={showBuses}
                onCheckedChange={onToggleBuses}
              />
            </div>
            {/* Buses Switch */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="showMetro">🚃 Trains</Label>
              <Switch
                id="showMetro"
                checked={showMetro}
                onCheckedChange={onToggleMetro}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="showCableway">🚋 Cableway</Label>
            <Switch
              id="showCableway"
              className="ml-auto"
              checked={showCableway}
              onCheckedChange={onToggleCableway}
            />
          </div>
        </div>
      </div>
    )
  },
)
