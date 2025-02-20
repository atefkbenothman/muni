"use server";
import { createClient } from "@/utils/server";
import { Content } from "@/components/content";

export default async function Home() {
  const client = await createClient();

  const { data: linesData, error: linesError } = await client
    .from("lines")
    .select("*");

  const { data: operatorsData, error: operatorsError } = await client
    .from("operators")
    .select("*");

  const { data: stopsData, error: stopsError } = await client
    .from("stops")
    .select("*");

  const { data: patternsData, error: patternsError } = await client
    .from("patterns")
    .select("*")
    .eq("LineRef", "L");

  const lines = linesData ?? [];
  const stops = stopsData ?? [];
  const operators = operatorsData ?? [];
  const patterns = patternsData ?? [];

  // THIS CODE ITERATES THROUGH STOP POINTS AND PRINTS ALL STOP REFS
  // patterns.forEach((pattern) => {
  //   const pointsInSequence = pattern.PointsInSequence as string | null;
  //   if (pointsInSequence) {
  //     const cleanedPoints = pointsInSequence.replace(/'/g, '"');
  //     const stopPoints = JSON.parse(cleanedPoints)["StopPointInJourneyPattern"];
  //     stopPoints.forEach((stop: any) => {
  //       const stopRef = stop["ScheduledStopPointRef"];
  //       console.log(stopRef);
  //     });
  //   }
  // });

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <div className="w-full p-6">
        <h1 className="text-lg font-semibold text-center">
          San Francisco Muni Map
        </h1>
      </div>
      <Content lines={lines} stops={stops} operators={operators} />
    </div>
  );
}
