"use server";

import { MuniMap } from "@/components/muni-map";

export default async function Home() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <div className="w-full p-6">
        <h1 className="text-lg font-semibold text-center">
          San Francisco Muni Map
        </h1>
      </div>
      <MuniMap />
    </div>
  );
}
