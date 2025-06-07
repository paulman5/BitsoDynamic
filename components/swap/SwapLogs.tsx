import React from "react"

export type SwapLogsProps = {
  logs: string[]
  isSwapping: boolean
}

export function SwapLogs({ logs, isSwapping }: SwapLogsProps) {
  if (!isSwapping || logs.length === 0) return null
  return (
    <div className="text-xs text-blue-700 bg-blue-50 rounded p-3 mb-4">
      <div className="font-semibold mb-2">Swap Progress</div>
      <ul className="list-disc pl-5 space-y-1">
        {logs.map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
    </div>
  )
}
