interface CountdownProps {
  lastUpdate: string
}

export function Countdown({ lastUpdate }: CountdownProps) {
  return (
    <p className="text-sm text-secondary px-2 md:px-0 pb-2">
      Last Updated: {lastUpdate}
    </p>
  )
}
