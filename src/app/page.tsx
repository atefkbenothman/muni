"use server";

import { MuniMap } from "@/components/muni-map";

export default async function Home() {
  return (
    <div className="flex min-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl rounded-sm p-6">
        <h1 className="text-lg font-semibold text-center">SF Muni Map</h1>
      </div>
      <MuniMap />
    </div>
  );
}
