export type Operator = {
  Id: string;
  Name: string;
  ShortName: string | null;
  SiriOperatorRef: null | string;
  TimeZone: string;
  DefaultLanguage: string;
  ContactTelephoneNumber: null | string;
  WebSite: null | string;
  PrimaryMode: string;
  PrivateCode: string;
  Monitored: boolean;
  OtherModes: string;
}

export type TransitLine = {
  Id: string;
  Name: string;
  FromDate: string;
  ToDate: string;
  TransportMode: string;
  PublicCode: string;
  SiriLineRef: string;
  Monitored: boolean;
  OperatorRef: string;
}

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

export type Stops = {
  id: string;
  Extensions: {
    LocationType: null | string;
    PlatformCode: null | string;
    ParentStation: null | string;
    ValidBetween: {
      FromDate: string;
      ToDate: string;
    };
  };
  Name: string;
  Location: {
    Longitude: string;
    Latitude: string;
  };
  Url: string;
  StopType: string; 
}

export type StopsData = {
  Contents: {
    ResponseTimestamp: string;
    dataObjects: {
      id: string;
      ScheduledStopPoint: Stops[]
    };
  };
}

export type StopPlaces = {
  Siri: {
    ServiceDelivery: {
      ResponseTimestamp: string;
      DataObjectDelivery: {
        ResponseTimestamp: string;
        dataObjects: {
          SiteFrame: {
            "@version": string;
            "@id": string;
            stopPlaces: {
              StopPlace: Array<{
                "@version": string;
                "@id": string;
                ValidBetween: {
                  FromDate: string;
                  ToDate: string;
                };
                Name: string;
                Description: null;
                Centroid: {
                  Location: {
                    Longitude: string;
                    Latitude: string;
                  };
                };
                AccessibilityAssessment: {
                  "@version": string;
                  "@id": string;
                  MobilityImpairedAccess: string;
                  limitations: {
                    AccessibilityLimitation: {
                      WheelchairAccess: string;
                    };
                  };
                };
                PostalAddress: {
                  AddressLine1: string;
                  Town: string;
                };
                Url: string;
                OperatorRef: {
                  "@ref": string;
                };
                adjacentSites: {
                  ParkingRef: {
                    "@ref": string;
                  };
                };
                PublicCode: string;
                TransportMode: string;
                StopPlaceType: string;
              }>;
            };
          };
        };
      };
    };
  };
};