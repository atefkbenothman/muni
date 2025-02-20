import { useState } from "react";

export const useTransitData = (initialOperator: string) => {
  const [selectedOperator, setSelectedOperator] = useState<string>(initialOperator);
  const [selectedLine, setSelectedLine] = useState<string>("All");
  const [showBuses, setShowBuses] = useState<boolean>(true);
  const [showMetro, setShowMetro] = useState<boolean>(true);
  const [showCableway, setShowCableway] = useState<boolean>(true);

  return {
    selectedOperator,
    setSelectedOperator,
    selectedLine,
    setSelectedLine,
    showBuses,
    setShowBuses,
    showMetro,
    setShowMetro,
    showCableway,
    setShowCableway,
  };
};
