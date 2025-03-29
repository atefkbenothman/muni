"use server"

import { createClient } from "@/utils/server"
import { VehicleActivity } from "@/types/transit-types"
import { RealtimeChannel } from "@supabase/supabase-js"

const apiKey = process.env.TRANSIT_API_KEY
const agency = "SF"
const operatorId = "SF"

export async function getVehicleMonitoring() {
  const response = await fetch(
    `http://api.511.org/transit/VehicleMonitoring?api_key=${apiKey}&agency=${agency}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  )
  const data = await response.json()
  return data["Siri"]["ServiceDelivery"]["VehicleMonitoringDelivery"][
    "VehicleActivity"
  ] as VehicleActivity[]
}

export async function getLatestVehicleMonitoring() {
  const client = await createClient();

  const { data: data, error: error } = await client
    .from("vehicle_monitoring")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error("Error fetching latest vehicle monitoring:", error);
    return null
  }

  return data
}

export async function getTransitLines() {
  const client = await createClient()

  const { data: data, error: error } = await client
    .from("lines")
    .select("*")

  if (error) {
    console.error("Error fetching lines:", error)
    return []
  }

  return data
}

export async function getTransitStops() {
  const client = await createClient()

  const { data: data, error: error } = await client
    .from("stops")
    .select("*")

  if (error) {
    console.error("Error fetching stops:", error)
    return []
  }

  return data
}

export async function getTransitOperators() {
  const client = await createClient()

  const { data: data, error: error } = await client
    .from("operators")
    .select("*")

  if (error) {
    console.error("Error fetching operators:", error)
    return []
  }

  return data
}

export async function getPatternsByLine(lineRef: string) {
  const client = await createClient()

  const { data, error } = await client
    .from("patterns")
    .select("*")
    .eq("LineRef", lineRef)

  if (error) {
    console.error("Error fetching patterns:", error)
    return []
  }

  return data
}
