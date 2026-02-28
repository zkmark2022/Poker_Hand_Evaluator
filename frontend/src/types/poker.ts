export type Suit = 's' | 'h' | 'd' | 'c'
export type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2'

export type Card = {
  rank: Rank
  suit: Suit
}

export type Street = 'preflop' | 'flop' | 'turn' | 'river'

export type Player = {
  name: string
  cards: Card[]
  equity?: number
}

export type GameState = {
  players: Player[]
  communityCards: Card[]
  street: Street
  isCalculating: boolean
  equities?: number[]
}
