import type { Player } from '../types/poker'
import Card from './Card'
import HandPrediction from './HandPrediction'

type Props = {
  player: Player
  position: 'top' | 'bottom-left' | 'bottom-right'
  isCalculating: boolean
}

const POSITION_COLORS: Record<string, string> = {
  'top': 'bg-blue-900/60 border-blue-500',
  'bottom-left': 'bg-emerald-900/60 border-emerald-500',
  'bottom-right': 'bg-amber-900/60 border-amber-500',
}

const EQUITY_COLORS: Record<string, string> = {
  'top': 'text-blue-300',
  'bottom-left': 'text-emerald-300',
  'bottom-right': 'text-amber-300',
}

function EquityChange({ change }: { change?: number }) {
  if (change === undefined || Math.abs(change) < 0.05) return null
  if (change > 0) {
    return <span className="text-green-400 text-xs font-bold">↑ +{change.toFixed(1)}%</span>
  }
  return <span className="text-red-400 text-xs font-bold">↓ {change.toFixed(1)}%</span>
}

export default function PlayerHand({ player, position, isCalculating }: Props) {
  return (
    <div
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border ${POSITION_COLORS[position]} backdrop-blur-sm min-w-[130px]`}
    >
      <span className="text-white font-semibold text-sm tracking-wide">{player.name}</span>
      <div className="flex gap-1.5">
        <Card card={player.cards[0]} />
        <Card card={player.cards[1]} />
      </div>
      <div className={`flex items-center gap-1.5 text-lg font-bold ${EQUITY_COLORS[position]}`}>
        {isCalculating ? (
          <span className="animate-pulse">…</span>
        ) : player.equity !== undefined ? (
          <>
            <span>{player.equity.toFixed(1)}%</span>
            <EquityChange change={player.equityChange} />
          </>
        ) : (
          '—'
        )}
      </div>
      {!isCalculating && (
        <HandPrediction
          currentHand={player.currentHand}
          winningHands={player.winningHands}
        />
      )}
    </div>
  )
}
