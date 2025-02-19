"use server"

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