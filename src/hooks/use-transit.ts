import { useState } from "react";

export const useTransitData = (initialOperator: string) => {
  const [selectedOperator, setSelectedOperator] = useState<string>(initialOperator);
  const [selectedLine, setSelectedLine] = useState<string>("All");

  return {
    selectedOperator,
    setSelectedOperator,
    selectedLine,
    setSelectedLine,
  };
};