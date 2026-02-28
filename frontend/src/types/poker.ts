export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'

export type Card = {
  rank: Rank
  suit: Suit
}

export type Street = 'preflop' | 'flop' | 'turn' | 'river'

export type Player = {
  id: number
  name: string
  holeCards: [Card, Card]
  equity: number
  winProbability: number
  tieProbability: number
}

export type GameState = {
  players: Player[]
  communityCards: Card[]
  street: Street
  isCalculating: boolean
}

export type EquityRequest = {
  players: Array<{ hole_cards: string[] }>
  community_cards: string[]
}

export type EquityResponse = {
  players: Array<{
    win_probability: number
    tie_probability: number
    equity: number
  }>
}
