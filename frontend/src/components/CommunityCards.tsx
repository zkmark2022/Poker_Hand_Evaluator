import type { Card as CardType } from '../types/poker'
import Card from './Card'

type Props = {
  cards: CardType[]
}

export default function CommunityCards({ cards }: Props) {
  const slots = Array.from({ length: 5 }, (_, i) => cards[i])

  return (
    <div className="flex items-center gap-2 justify-center">
      {slots.map((card, i) => (
        <Card key={i} card={card} />
      ))}
    </div>
  )
}
