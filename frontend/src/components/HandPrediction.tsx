import type { WinningHand } from '../types/poker'

type Props = {
  currentHand?: string
  winningHands?: WinningHand[]
  isCalculating: boolean
}

const HAND_COLORS: Record<string, string> = {
  'High Card': 'text-gray-400',
  'One Pair': 'text-gray-400',
  'Two Pair': 'text-blue-400',
  'Three of a Kind': 'text-blue-400',
  'Straight': 'text-green-400',
  'Flush': 'text-green-400',
  'Full House': 'text-purple-400',
  'Four of a Kind': 'text-purple-400',
  'Straight Flush': 'text-yellow-400',
  'Royal Flush': 'text-yellow-400',
}

export default function HandPrediction({ currentHand, winningHands, isCalculating }: Props) {
  if (isCalculating) {
    return <div className="text-xs text-gray-500 animate-pulse">Calculating...</div>
  }

  if (!currentHand) {
    return null
  }

  const handColor = HAND_COLORS[currentHand] || 'text-gray-400'

  return (
    <div className="text-center mt-1">
      <div className={`text-xs font-semibold ${handColor}`}>
        {currentHand}
      </div>
      {winningHands && winningHands.length > 0 && (
        <div className="text-[10px] text-gray-500 mt-0.5">
          {winningHands.slice(0, 2).map((wh, i) => (
            <span key={wh.hand}>
              {i > 0 && ' · '}
              {wh.hand}: {wh.probability.toFixed(0)}%
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
