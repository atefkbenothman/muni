# SF Muni Map

An interactive web application that displays real-time San Francisco Muni transit information using Next.js 15, Mapbox GL, and Supabase.

<br />

<img width="929" alt="Screenshot 2025-02-21 at 10 16 45 PM" src="https://github.com/user-attachments/assets/76969773-61bd-4fbe-938b-6ef160fec22c" />

## Features

- Real-time tracking of SF Muni vehicles 🚌
- Interactive map interface with vehicle and stop markers
- Detailed information popups for vehicles and stops
- Filtering by operator and line
- Transport mode toggles (Bus 🚎, Metro 🚃, Cableway 🚋)
- Auto-refresh functionality (10-minute intervals)
- Transit stop display toggle
- Responsive layout for desktop and mobile

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Supabase
- **Mapping**: Mapbox GL & React Map GL
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Turbopack

## Prerequisites

Before you begin, ensure you have:

- Node.js (Latest LTS version)
- npm, yarn, or pnpm
- Mapbox API Key
- Supabase Project and API Keys
- 511.org Transit API Key

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
TRANSIT_API_KEY=your_transit_api_key
```
