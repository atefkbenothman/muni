import { useState, useEffect } from 'react';

interface CountdownProps {
  lastUpdate: string
}

function isDST(date: Date): boolean {
  const jan = new Date(date.getFullYear(), 0, 1) // January (PST)
  const jul = new Date(date.getFullYear(), 6, 1) // July (PDT)
  const stdOffset = Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
  return date.getTimezoneOffset() < stdOffset
}

export function Countdown({ lastUpdate }: CountdownProps) {
  // State to store the seconds ago value
  const [secondsAgo, setSecondsAgo] = useState(0)

  useEffect(() => {
    // Parse the locale string
    const lastUpdateDate = new Date(lastUpdate)
    // Determine if we're in DST (PDT: UTC-7) or standard time (PST: UTC-8)
    const offsetHours = isDST(lastUpdateDate) ? 7 : 8
    const offsetMs = offsetHours * 60 * 60 * 1000

    // Convert last update to PST/PDT
    const lastUpdatePST = new Date(lastUpdateDate.getTime() - offsetMs)

    // Function to update seconds
    const updateSeconds = () => {
      const now = new Date()
      const nowPST = new Date(now.getTime() - offsetMs)
      const newSecondsAgo = Math.floor((nowPST.getTime() - lastUpdatePST.getTime()) / 1000)
      setSecondsAgo(newSecondsAgo)
    }

    updateSeconds()

    const interval = setInterval(updateSeconds, 1000)

    return () => clearInterval(interval)
  }, [lastUpdate])

  return (
    <p className="text-sm text-secondary px-2 md:px-0 pb-2">
      Last Updated: {secondsAgo} seconds ago
    </p>
  )
}
