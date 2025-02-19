"use client";

import { memo } from "react";
import { Tables } from "@/types/database.types";
import { VehicleActivity } from "@/types/transit-types";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { StopPopup } from "./stop-popup";
import { VehiclePopup } from "./vehicle-popup";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

const bounds: [number, number, number, number] = [
  -122.66336,
  37.492987, // Southwest coordinates
  -122.250481,
  37.871651, // Northeast coordinates
];

export type PopupInfo = {
  type: "vehicle" | "stop";
  data: VehicleActivity | Tables<"stops">;
  latitude: number;
  longitude: number;
};

type MapProps = {
  filteredVehicles: VehicleActivity[];
  showStops: boolean;
  stops: Tables<"stops">[];
  popupInfo: PopupInfo | null;
  setPopupInfo: (info: PopupInfo | null) => void;
  handleMarkerClick: (lineRef: string) => void;
};

export const MuniMap = memo(
  ({
    filteredVehicles,
    showStops,
    stops,
    popupInfo,
    setPopupInfo,
    handleMarkerClick,
  }: MapProps) => {
    return (
      <Map
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: -122.4194,
          latitude: 37.7749,
          zoom: 12,
        }}
        minZoom={8}
        mapStyle="mapbox://styles/mapbox/streets-v12?optimize=true"
        style={{ width: "100%", height: "100%" }}
        maxBounds={bounds}
      >
        {filteredVehicles.map((vehicle, idx) => (
          <Marker
            key={idx}
            longitude={Number(
              vehicle.MonitoredVehicleJourney.VehicleLocation.Longitude
            )}
            latitude={Number(
              vehicle.MonitoredVehicleJourney.VehicleLocation.Latitude
            )}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setPopupInfo({
                type: "vehicle",
                data: vehicle,
                latitude: Number(
                  vehicle.MonitoredVehicleJourney.VehicleLocation.Latitude
                ),
                longitude: Number(
                  vehicle.MonitoredVehicleJourney.VehicleLocation.Longitude
                ),
              });
              if (vehicle.MonitoredVehicleJourney.LineRef) {
                handleMarkerClick(vehicle.MonitoredVehicleJourney.LineRef);
              }
            }}
          >
            <div className="text-xl cursor-pointer">🚌</div>
          </Marker>
        ))}
        {showStops &&
          stops.map((stop) => (
            <Marker
              key={stop.id}
              longitude={Number(stop["Location/Longitude"])}
              latitude={Number(stop["Location/Latitude"])}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setPopupInfo({
                  type: "stop",
                  data: stop,
                  latitude: Number(stop["Location/Latitude"]),
                  longitude: Number(stop["Location/Longitude"]),
                });
              }}
            >
              <div className="text-xl cursor-pointer">🚏</div>
            </Marker>
          ))}
        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            onClose={() => setPopupInfo(null)}
            closeButton
            closeOnClick={false}
          >
            {popupInfo.type === "vehicle" ? (
              <VehiclePopup vehicle={popupInfo.data as VehicleActivity} />
            ) : (
              <StopPopup stop={popupInfo.data as Tables<"stops">} />
            )}
          </Popup>
        )}
      </Map>
    );
  }
);
