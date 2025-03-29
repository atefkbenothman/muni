export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      lines: {
        Row: {
          FromDate: string | null
          Id: string
          Monitored: boolean | null
          Name: string | null
          OperatorRef: string | null
          PublicCode: string | null
          SiriLineRef: string | null
          ToDate: string | null
          TransportMode: string | null
        }
        Insert: {
          FromDate?: string | null
          Id: string
          Monitored?: boolean | null
          Name?: string | null
          OperatorRef?: string | null
          PublicCode?: string | null
          SiriLineRef?: string | null
          ToDate?: string | null
          TransportMode?: string | null
        }
        Update: {
          FromDate?: string | null
          Id?: string
          Monitored?: boolean | null
          Name?: string | null
          OperatorRef?: string | null
          PublicCode?: string | null
          SiriLineRef?: string | null
          ToDate?: string | null
          TransportMode?: string | null
        }
        Relationships: []
      }
      operators: {
        Row: {
          ContactTelephoneNumber: string | null
          DefaultLanguage: string | null
          Id: string
          Monitored: boolean | null
          Name: string | null
          OtherModes: string | null
          PrimaryMode: string | null
          PrivateCode: string | null
          ShortName: string | null
          SiriOperatorRef: string | null
          TimeZone: string | null
          WebSite: string | null
        }
        Insert: {
          ContactTelephoneNumber?: string | null
          DefaultLanguage?: string | null
          Id: string
          Monitored?: boolean | null
          Name?: string | null
          OtherModes?: string | null
          PrimaryMode?: string | null
          PrivateCode?: string | null
          ShortName?: string | null
          SiriOperatorRef?: string | null
          TimeZone?: string | null
          WebSite?: string | null
        }
        Update: {
          ContactTelephoneNumber?: string | null
          DefaultLanguage?: string | null
          Id?: string
          Monitored?: boolean | null
          Name?: string | null
          OtherModes?: string | null
          PrimaryMode?: string | null
          PrivateCode?: string | null
          ShortName?: string | null
          SiriOperatorRef?: string | null
          TimeZone?: string | null
          WebSite?: string | null
        }
        Relationships: []
      }
      patterns: {
        Row: {
          DestinationDisplayView: Json | null
          DirectionRef: string | null
          FromDate: string | null
          LineRef: string | null
          LinksInSequence: Json | null
          Name: string | null
          PointsInSequence: Json | null
          serviceJourneyPatternRef: number
          ToDate: string | null
          TripCount: number | null
        }
        Insert: {
          DestinationDisplayView?: Json | null
          DirectionRef?: string | null
          FromDate?: string | null
          LineRef?: string | null
          LinksInSequence?: Json | null
          Name?: string | null
          PointsInSequence?: Json | null
          serviceJourneyPatternRef: number
          ToDate?: string | null
          TripCount?: number | null
        }
        Update: {
          DestinationDisplayView?: Json | null
          DirectionRef?: string | null
          FromDate?: string | null
          LineRef?: string | null
          LinksInSequence?: Json | null
          Name?: string | null
          PointsInSequence?: Json | null
          serviceJourneyPatternRef?: number
          ToDate?: string | null
          TripCount?: number | null
        }
        Relationships: []
      }
      stops: {
        Row: {
          "Extensions/LocationType": string | null
          "Extensions/ParentStation": string | null
          "Extensions/PlatformCode": string | null
          "Extensions/ValidBetween/FromDate": string | null
          "Extensions/ValidBetween/ToDate": string | null
          id: number
          "Location/Latitude": number | null
          "Location/Longitude": number | null
          Name: string | null
          StopType: string | null
          Url: string | null
        }
        Insert: {
          "Extensions/LocationType"?: string | null
          "Extensions/ParentStation"?: string | null
          "Extensions/PlatformCode"?: string | null
          "Extensions/ValidBetween/FromDate"?: string | null
          "Extensions/ValidBetween/ToDate"?: string | null
          id: number
          "Location/Latitude"?: number | null
          "Location/Longitude"?: number | null
          Name?: string | null
          StopType?: string | null
          Url?: string | null
        }
        Update: {
          "Extensions/LocationType"?: string | null
          "Extensions/ParentStation"?: string | null
          "Extensions/PlatformCode"?: string | null
          "Extensions/ValidBetween/FromDate"?: string | null
          "Extensions/ValidBetween/ToDate"?: string | null
          id?: number
          "Location/Latitude"?: number | null
          "Location/Longitude"?: number | null
          Name?: string | null
          StopType?: string | null
          Url?: string | null
        }
        Relationships: []
      }
      vehicle_monitoring: {
        Row: {
          created_at: string
          data: Json
          id: number
          recorded_at: string
        }
        Insert: {
          created_at?: string
          data: Json
          id?: number
          recorded_at: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: number
          recorded_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
