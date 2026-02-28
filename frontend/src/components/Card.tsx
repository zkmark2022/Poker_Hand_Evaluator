import type { Card as CardType } from '../types/poker'

type Props = {
  card: CardType
  faceDown?: boolean
}

const SUIT_SYMBOLS: Record<string, string> = {
  s: '♠',
  h: '♥',
  d: '♦',
  c: '♣',
}

const SUIT_COLORS: Record<string, string> = {
  s: 'text-gray-900',
  h: 'text-red-600',
  d: 'text-red-600',
  c: 'text-gray-900',
}

export default function Card({ card, faceDown = false }: Props) {
  if (faceDown) {
    return (
      <div className="w-12 h-16 rounded-md bg-gradient-to-br from-blue-800 to-blue-950 border border-blue-600 shadow-md" />
    )
  }

  return (
    <div className="w-12 h-16 rounded-md bg-white border border-gray-300 shadow-md flex flex-col items-center justify-center">
      <span className={`text-lg font-bold ${SUIT_COLORS[card.suit]}`}>{card.rank}</span>
      <span className={`text-xl ${SUIT_COLORS[card.suit]}`}>{SUIT_SYMBOLS[card.suit]}</span>
    </div>
  )
}
