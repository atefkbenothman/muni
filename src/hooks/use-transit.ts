import { useState, useEffect } from "react";
import { getOperators, getLines } from "@/actions/muni-actions";
import type { Operator, TransitLine } from "@/types/transit-types";

export const useTransitData = (initialOperator: string) => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>(initialOperator);
  const [transitLines, setTransitLines] = useState<TransitLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch both operators and transit lines
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [operatorsData, transitLinesData] = await Promise.all([
          getOperators(),
          getLines()
        ]);

        setOperators(operatorsData);
        setTransitLines(transitLinesData);
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
    isLoading,
    error
  };
};