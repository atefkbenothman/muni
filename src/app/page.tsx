"use server";
import { createClient } from "@/utils/server";
import { MuniMap } from "@/components/muni-map";

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

  const lines = linesData ?? [];
  const stops = stopsData ?? [];
  const operators = operatorsData ?? [];

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <div className="w-full p-6">
        <h1 className="text-lg font-semibold text-center">
          San Francisco Muni Map
        </h1>
      </div>
      <MuniMap lines={lines} stops={stops} operators={operators} />
    </div>
  );
}
