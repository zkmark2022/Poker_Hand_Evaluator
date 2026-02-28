import { useState, useCallback } from 'react'
import type { Card, GameState, Player, Rank, Suit, Street } from '../types/poker'
import { calculateEquity } from '../api/equity'

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs']
const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

function buildDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit })
    }
  }
  return deck
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function dealInitialState(): { players: Player[]; deck: Card[] } {
  const deck = shuffle(buildDeck())
  let cursor = 0

  const take = (): Card => deck[cursor++]

  const players: Player[] = [
    { id: 0, name: 'Player 1', holeCards: [take(), take()], equity: 33.3, winProbability: 33.3, tieProbability: 0 },
    { id: 1, name: 'Player 2', holeCards: [take(), take()], equity: 33.3, winProbability: 33.3, tieProbability: 0 },
    { id: 2, name: 'Player 3', holeCards: [take(), take()], equity: 33.3, winProbability: 33.3, tieProbability: 0 },
  ]

  return { players, deck: deck.slice(cursor) }
}

const STREET_ORDER: Street[] = ['preflop', 'flop', 'turn', 'river']
const COMMUNITY_CARDS_PER_STREET: Record<Street, number> = {
  preflop: 0,
  flop: 3,
  turn: 4,
  river: 5,
}

export function usePokerGame() {
  const initial = dealInitialState()
  const [state, setState] = useState<GameState>({
    players: initial.players,
    communityCards: [],
    street: 'preflop',
    isCalculating: false,
  })
  const [remainingDeck, setRemainingDeck] = useState<Card[]>(initial.deck)

  const fetchEquity = useCallback(
    async (players: Player[], communityCards: Card[]) => {
      setState((s) => ({ ...s, isCalculating: true }))
      try {
        const result = await calculateEquity(
          players.map((p) => p.holeCards),
          communityCards,
        )
        setState((s) => ({
          ...s,
          isCalculating: false,
          players: s.players.map((p, i) => ({
            ...p,
            equity: result.players[i]?.equity ?? p.equity,
            winProbability: result.players[i]?.win_probability ?? p.winProbability,
            tieProbability: result.players[i]?.tie_probability ?? p.tieProbability,
          })),
        }))
      } catch {
        setState((s) => ({ ...s, isCalculating: false }))
      }
    },
    [],
  )

  const dealNext = useCallback(() => {
    setState((s) => {
      const currentIdx = STREET_ORDER.indexOf(s.street)
      if (currentIdx === STREET_ORDER.length - 1) return s

      const nextStreet = STREET_ORDER[currentIdx + 1]
      const targetCount = COMMUNITY_CARDS_PER_STREET[nextStreet]
      const cardsNeeded = targetCount - s.communityCards.length

      const newCards = remainingDeck.slice(0, cardsNeeded)
      setRemainingDeck((d) => d.slice(cardsNeeded))

      const newCommunity = [...s.communityCards, ...newCards]

      fetchEquity(s.players, newCommunity)

      return { ...s, street: nextStreet, communityCards: newCommunity }
    })
  }, [remainingDeck, fetchEquity])

  const reset = useCallback(() => {
    const { players, deck } = dealInitialState()
    setState({
      players,
      communityCards: [],
      street: 'preflop',
      isCalculating: false,
    })
    setRemainingDeck(deck)
    fetchEquity(players, [])
  }, [fetchEquity])

  return { state, dealNext, reset }
}
