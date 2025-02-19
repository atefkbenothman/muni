import { useState, useEffect } from "react";
import { getOperators, getLines, getStops } from "@/actions/muni-actions";
import { type Stops, type Operator, type TransitLine } from "@/types/transit-types";

export const useTransitData = (initialOperator: string) => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>(initialOperator);
  const [transitLines, setTransitLines] = useState<TransitLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [stops, setStops] = useState<Stops[]>([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch both operators and transit lines
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // const [operatorsData, transitLinesData, stopsData] = await Promise.all([
        //   getOperators(),
        //   getLines(),
        //   getStops(),
        // ]);

        // const stopsData = await getStops()
        // setStops(stopsData.Contents.dataObjects.ScheduledStopPoint)

        // setOperators(operatorsData);
        // setTransitLines(transitLinesData);
        // setStops(stopsData)
      } catch (err) {
        setError("Failed to fetch transit data");
        console.error("Error fetching transit data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedOperator]); // Refetch when operator changes

  return {
    operators,
    selectedOperator,
    setSelectedOperator,
    transitLines,
    selectedLine,
    setSelectedLine,
    stops,
    isLoading,
    error
  };
};