"use server"

import { Operator } from "@/types/transit-types";
import { TransitLine } from "@/types/transit-types";

const apiKey = process.env.TRANSIT_API_KEY;
const agency = "SF";
const operatorId = "SF"

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
  return data
}

export async function getOperators() {
  const response = await fetch(`http://api.511.org/transit/operators?api_key=${apiKey}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()
  return data as Operator[]
}

export async function getLines() {
  const response = await fetch(`http://api.511.org/transit/lines?api_key=${apiKey}&operator_id=${operatorId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  const data = await response.json()
  return data as TransitLine[]
}