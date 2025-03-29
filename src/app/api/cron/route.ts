import { NextResponse } from "next/server"
import { getVehicleMonitoring } from "@/actions/muni-actions"
import { createClient } from "@/utils/server"

export async function GET() {
  try {
    const data = await getVehicleMonitoring()

    const client = await createClient()

    const { error } = await client.from("vehicle_monitoring").insert({
      recorded_at: new Date().toISOString(),
      data: data
    })

    if (error) {
      console.error("Error inserting data into Supabase:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    console.log("success")
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Error in GET handler:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
