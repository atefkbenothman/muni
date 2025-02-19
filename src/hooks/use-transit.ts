import { useState } from "react";
import { STOPS_DATA } from "@/data/stops-data";
import { LINES_DATA } from "@/data/lines-data";
import { OPERATORS_DATA } from "@/data/operators-data";

const stopsData = STOPS_DATA.Contents.dataObjects.ScheduledStopPoint
const linesData = LINES_DATA
const operatorsData = OPERATORS_DATA

export const useTransitData = (initialOperator: string) => {
  const [selectedOperator, setSelectedOperator] = useState<string>(initialOperator);
  const [selectedLine, setSelectedLine] = useState<string>("All");

  return {
    operators: operatorsData,
    selectedOperator,
    setSelectedOperator,
    transitLines: linesData,
    selectedLine,
    setSelectedLine,
    stops: stopsData,
  };
};