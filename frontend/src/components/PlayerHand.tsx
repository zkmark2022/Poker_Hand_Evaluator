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

export default function PlayerHand({ player, position, isCalculating }: Props) {
  const equityChange = player.equityChange
  
  return (
    <div
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border ${POSITION_COLORS[position]} backdrop-blur-sm`}
    >
      <span className="text-white font-semibold text-sm tracking-wide">{player.name}</span>
      <div className="flex gap-1.5">
        <Card card={player.cards[0]} />
        <Card card={player.cards[1]} />
      </div>
      <div className={`text-lg font-bold ${EQUITY_COLORS[position]} flex items-center gap-1`}>
        {isCalculating ? (
          <span className="animate-pulse">…</span>
        ) : player.equity !== undefined ? (
          <>
            {player.equity.toFixed(1)}%
            {equityChange !== undefined && equityChange !== 0 && (
              <span className={`text-xs ${equityChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {equityChange > 0 ? '↑' : '↓'}{Math.abs(equityChange).toFixed(1)}
              </span>
            )}
          </>
        ) : (
          '—'
        )}
      </div>
      <HandPrediction 
        currentHand={player.currentHand}
        winningHands={player.winningHands}
        isCalculating={isCalculating}
      />
    </div>
  )
}
