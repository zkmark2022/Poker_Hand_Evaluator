import type { Card as CardType } from '../types/poker'

type Props = {
  card?: CardType
  faceDown?: boolean
  small?: boolean
}

const SUIT_SYMBOLS: Record<string, string> = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
}

const RED_SUITS = new Set(['hearts', 'diamonds'])

export default function Card({ card, faceDown = false, small = false }: Props) {
  const base = small
    ? 'w-8 h-12 rounded text-xs font-bold select-none'
    : 'w-12 h-20 rounded-md text-sm font-bold select-none'

  if (faceDown || !card) {
    return (
      <div
        className={`${base} bg-blue-800 border-2 border-blue-600 flex items-center justify-center shadow-md`}
      >
        <span className="text-blue-400 text-lg">🂠</span>
      </div>
    )
  }

  const isRed = RED_SUITS.has(card.suit)
  const textColor = isRed ? 'text-red-600' : 'text-gray-900'
  const symbol = SUIT_SYMBOLS[card.suit]

  return (
    <div
      className={`${base} bg-white border border-gray-300 shadow-md flex flex-col justify-between p-0.5`}
    >
      <div className={`${textColor} leading-none`}>
        <div>{card.rank}</div>
        <div>{symbol}</div>
      </div>
      <div className={`${textColor} leading-none self-end rotate-180`}>
        <div>{card.rank}</div>
        <div>{symbol}</div>
      </div>
    </div>
  )
}
