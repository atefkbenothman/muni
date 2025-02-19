export type VehicleActivity = {
  RecordedAtTime: string;
  ValidUntilTime: string;
  MonitoredVehicleJourney: {
    LineRef: string | null;
    DirectionRef: string | null;
    FramedVehicleJourneyRef: {
      DataFrameRef: string;
      DatedVehicleJourneyRef: string | null;
    };
    PublishedLineName: string | null;
    OperatorRef: string;
    OriginRef: string | null;
    OriginName: string | null;
    DestinationRef: string | null;
    DestinationName: string | null;
    Monitored: boolean;
    InCongestion: boolean | null;
    VehicleLocation: {
      Longitude: string;
      Latitude: string;
    };
    Bearing: string;
    Occupancy: string;
    VehicleRef: string;
  };
};