# SF Muni Map

An interactive web application that displays real-time San Francisco Muni transit information using Next.js, Mapbox GL, and Supabase.

## Features

- Real-time tracking of SF Muni vehicles 🚌
- Interactive map interface with vehicle and stop markers
- Detailed information popups for vehicles and stops
- Filtering capabilities by operator and line
- Auto-refresh functionality to keep data current
- Toggle display of transit stops

## Tech Stack

- **Frontend Framework**: Next.js 15
- **Mapping**: Mapbox GL & React Map GL
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn or pnpm
- Mapbox API Key
- Supabase Project and API Keys
- Transit API Key

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
TRANSIT_API_KEY=your_transit_api_key
```
