const MIN_EQUITY_TO_DISPLAY_IN_BAR = 12

type PlayerEquity = {
  name: string
  equity: number
}

type Props = {
  players: PlayerEquity[]
  isCalculating: boolean
}

const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500']

export default function EquityBar({ players, isCalculating }: Props) {
  const total = players.reduce((sum, p) => sum + p.equity, 0)

  return (
    <div className="w-full">
      <div className="flex h-8 rounded-lg overflow-hidden bg-gray-800">
        {players.map((player, index) => {
          const width = total > 0 ? (player.equity / total) * 100 : 33.33
          return (
            <div
              key={player.name}
              className={`${COLORS[index]} flex items-center justify-center transition-all duration-500`}
              style={{ width: `${width}%` }}
            >
              {!isCalculating && player.equity >= MIN_EQUITY_TO_DISPLAY_IN_BAR && (
                <span className="text-white text-sm font-bold">{player.equity.toFixed(1)}%</span>
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-400">
        {players.map((player) => (
          <span key={player.name} className={`${isCalculating ? 'animate-pulse' : ''}`}>
            {player.name}: {isCalculating ? '...' : `${player.equity.toFixed(1)}%`}
          </span>
        ))}
      </div>
    </div>
  )
}
