import { Directions } from "@/types/transit-types"
import { useCallback, useState } from "react"

export type TransitModes = {
  buses: boolean
  metro: boolean
  cableway: boolean
}

type Filters = {
  selectedOperator: string
  selectedLine: string
  selectedDirection: Directions
  visibleModes: TransitModes
  showStops: boolean
}

const DEFAULT_FILTERS: Filters = {
  selectedOperator: "SF",
  selectedLine: "All",
  selectedDirection: "BOTH",
  visibleModes: {
    buses: true,
    metro: true,
    cableway: true
  },
  showStops: true
}

export const useFilters = () => {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const selectLine = useCallback((lineId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedLine: lineId
    }))
  }, [])

  const selectOperator = useCallback((operatorId: string) => {
    setFilters(prev => ({
      ...prev,
      selectedOperator: operatorId
    }))
  }, [])

  const selectDirection = useCallback((direction: Directions) => {
    setFilters(prev => ({
      ...prev,
      selectedDirection: direction
    }))
  }, [])

  const toggleTransitMode = useCallback((mode: keyof TransitModes) => {
    setFilters(prev => ({
      ...prev,
      visibleModes: {
        ...prev.visibleModes,
        [mode]: !prev.visibleModes[mode]
      }
    }))
  }, [])

  const toggleStops = useCallback((mode: boolean) => {
    setFilters(prev => ({
      ...prev,
      showStops: mode
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  return {
    filters,
    selectOperator,
    selectLine,
    selectDirection,
    toggleTransitMode,
    toggleStops,
    resetFilters
  }
}
