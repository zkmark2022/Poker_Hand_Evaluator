import type { WinningHand } from '../types/poker'

type Props = {
  currentHand?: string
  winningHands?: WinningHand[]
}

// Maps hand name substring to Tailwind color class by strength tier
function handColor(hand: string): string {
  const h = hand.toLowerCase()
  if (h.includes('royal flush') || h.includes('straight flush')) return 'text-yellow-400'
  if (h.includes('four of a kind') || h.includes('full house')) return 'text-purple-400'
  if (h.includes('flush') || h.includes('straight')) return 'text-green-400'
  if (h.includes('three of a kind') || h.includes('two pair')) return 'text-blue-400'
  return 'text-gray-400'
}

export default function HandPrediction({ currentHand, winningHands }: Props) {
  const topHands = winningHands?.slice(0, 3) ?? []

  if (!currentHand && topHands.length === 0) return null

  return (
    <div className="w-full mt-0.5">
      {currentHand && (
        <div className={`text-center text-xs font-bold uppercase tracking-wide ${handColor(currentHand)}`}>
          {currentHand}
        </div>
      )}
      {topHands.length > 0 && (
        <div className="mt-1 space-y-0.5 border-t border-white/10 pt-1">
          {topHands.map((wh) => (
            <div key={wh.hand} className="flex justify-between items-center text-[10px] gap-2">
              <span className={`truncate ${handColor(wh.hand)}`}>{wh.hand}</span>
              <span className="text-gray-400 shrink-0">{(wh.probability * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
