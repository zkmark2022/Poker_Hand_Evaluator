type Props = {
  players: Array<{ name: string; equity: number }>
  isCalculating: boolean
}

const PLAYER_COLORS = [
  { bg: 'bg-blue-500', text: 'text-blue-300' },
  { bg: 'bg-emerald-500', text: 'text-emerald-300' },
  { bg: 'bg-amber-500', text: 'text-amber-300' },
]

export default function EquityBar({ players, isCalculating }: Props) {
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex rounded-full overflow-hidden h-4 shadow-inner">
        {players.map((p, i) => (
          <div
            key={p.name}
            className={`${PLAYER_COLORS[i % PLAYER_COLORS.length].bg} transition-all duration-700 ease-in-out flex items-center justify-center`}
            style={{ width: `${p.equity}%` }}
          >
            {p.equity > 12 && (
              <span className="text-white text-xs font-bold truncate px-1">
                {p.equity.toFixed(1)}%
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {players.map((p, i) => (
          <div key={p.name} className="flex items-center gap-1">
            <div
              className={`w-2 h-2 rounded-full ${PLAYER_COLORS[i % PLAYER_COLORS.length].bg}`}
            />
            <span className={`text-xs ${PLAYER_COLORS[i % PLAYER_COLORS.length].text}`}>
              {p.name}: {isCalculating ? '…' : `${p.equity.toFixed(1)}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
