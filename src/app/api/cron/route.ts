import { NextResponse } from "next/server"
import { getVehicleMonitoring } from "@/actions/muni-actions"

export async function GET() {
  const data = await getVehicleMonitoring()
  console.log(data)
  return NextResponse.json({ ok: true, data: data })
}
