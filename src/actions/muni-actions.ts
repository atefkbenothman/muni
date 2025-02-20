"use server"

import { createClient } from "@/utils/server";
import { VehicleActivity } from "@/types/transit-types";

const apiKey = process.env.TRANSIT_API_KEY;
const agency = "SF";
const operatorId = "SF";

export async function getVehicleMonitoring() {
  const response = await fetch(
    `http://api.511.org/transit/VehicleMonitoring?api_key=${apiKey}&agency=${agency}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data["Siri"]["ServiceDelivery"]["VehicleMonitoringDelivery"]["VehicleActivity"] as VehicleActivity[];
}

export async function getPatternsByLine(lineRef: string) {
  const client = await createClient();

  const { data, error } = await client
    .from("patterns")
    .select("*")
    .eq("LineRef", lineRef);

  if (error) {
    console.error("Error fetching patterns:", error);
    return [];
  }

  return data;
}
