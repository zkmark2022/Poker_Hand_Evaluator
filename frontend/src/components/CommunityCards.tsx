import type { Card as CardType } from '../types/poker'
import Card from './Card'

type Props = {
  cards: CardType[]
}

export default function CommunityCards({ cards }: Props) {
  const slots = 5
  const filledCards = [...cards]
  while (filledCards.length < slots) {
    filledCards.push(null as unknown as CardType)
  }

  return (
    <div className="flex gap-2">
      {filledCards.map((card, i) => (
        <div key={i}>
          {card ? (
            <Card card={card} />
          ) : (
            <div className="w-12 h-16 rounded-md border-2 border-dashed border-green-700/50 bg-green-900/30" />
          )}
        </div>
      ))}
    </div>
  )
}
