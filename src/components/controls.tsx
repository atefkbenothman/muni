import { memo, useState } from "react"
import type { TransitLine, TransitOperator } from "@/types/transit-types"
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
    transitLines,
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
    const [open, setOpen] = useState(false)

    console.log(selectedLine)

    return (
      <div className="flex h-full flex-col justify-center space-y-12 px-12">
        <div className="flex items-center">
          <Label htmlFor="showStops">Lines</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild className="ml-auto">
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[8rem] justify-between"
              >
                {transitLines.find((line) => line.Id === selectedLine)?.Id ||
                  "All"}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search line..."
                  className="h-9"
                  onFocus={() => setOpen(true)}
                  onBlur={() => setOpen(false)}
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
                          setOpen(false)
                        }}
                      >
                        {line.Name} ({line.PublicCode})
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
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="showStops">Stops 📍</Label>
            <Switch
              id="showStops"
              className="ml-auto"
              checked={showStops}
              onCheckedChange={onToggleStops}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="showBuses">Buses 🚌</Label>
            <Switch
              id="showBuses"
              className="ml-auto"
              checked={showBuses}
              onCheckedChange={onToggleBuses}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="showMetro">Trains 🚃</Label>
            <Switch
              id="showMetro"
              className="ml-auto"
              checked={showMetro}
              onCheckedChange={onToggleMetro}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="showCableway">Cableway 🚋</Label>
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
