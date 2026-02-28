import { useState, useCallback } from 'react'
import type { Card, GameState, Street, Player } from '../types/poker'
import { calculateEquity } from '../api/equity'

const SUITS: Card['suit'][] = ['s', 'h', 'd', 'c']
const RANKS: Card['rank'][] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']

const PLAYER_NAMES = ['Player 1', 'Player 2', 'Player 3']

function createDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit })
    }
  }
  return deck
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function dealInitialState(): { players: Player[]; deck: Card[] } {
  const deck = shuffle(createDeck())
  const players: Player[] = PLAYER_NAMES.map((name) => ({
    name,
    cards: [deck.pop()!, deck.pop()!],
    equity: undefined,
  }))
  return { players, deck }
}

const STREET_ORDER: Street[] = ['preflop', 'flop', 'turn', 'river']
const CARDS_TO_DEAL: Record<Street, number> = {
  preflop: 0,
  flop: 3,
  turn: 1,
  river: 1,
}

export function usePokerGame() {
  const [initialData] = useState(dealInitialState)
  const [state, setState] = useState<GameState>({
    players: initialData.players,
    communityCards: [],
    street: 'preflop',
    isCalculating: false,
  })
  const [remainingDeck, setRemainingDeck] = useState<Card[]>(initialData.deck)

  const fetchEquity = useCallback(
    async (players: Player[], board: Card[]) => {
      setState((s) => ({ ...s, isCalculating: true }))
      try {
        const result = await calculateEquity(
          players.map((p) => p.cards),
          board
        )
        setState((s) => ({
          ...s,
          players: s.players.map((p, i) => {
            const prevEquity = p.equity
            const newEquity = result.equities[i]
            const playerResult = result.players?.[i]
            return {
              ...p,
              equity: newEquity,
              currentHand: playerResult?.currentHand,
              winningHands: playerResult?.winningHands,
              equityChange: prevEquity !== undefined ? newEquity - prevEquity : undefined,
            }
          }),
          isCalculating: false,
        }))
      } catch (error) {
        console.error('Failed to fetch equity:', error)
        setState((s) => ({ ...s, isCalculating: false }))
      }
    },
    []
  )

  const dealNext = useCallback(() => {
    setState((currentState) => {
      const currentIndex = STREET_ORDER.indexOf(currentState.street)
      if (currentIndex >= STREET_ORDER.length - 1) return currentState

      const nextStreet = STREET_ORDER[currentIndex + 1]
      const cardsToDeal = CARDS_TO_DEAL[nextStreet]

      const newCards = remainingDeck.slice(0, cardsToDeal)
      setRemainingDeck((deck) => deck.slice(cardsToDeal))

      const newCommunityCards = [...currentState.communityCards, ...newCards]

      fetchEquity(currentState.players, newCommunityCards)

      return {
        ...currentState,
        communityCards: newCommunityCards,
        street: nextStreet,
      }
    })
  }, [remainingDeck, fetchEquity])

  const reset = useCallback(() => {
    const newData = dealInitialState()
    setState({
      players: newData.players,
      communityCards: [],
      street: 'preflop',
      isCalculating: false,
    })
    setRemainingDeck(newData.deck)
  }, [])

  return {
    state,
    dealNext,
    reset,
    canDeal: state.street !== 'river',
  }
}
