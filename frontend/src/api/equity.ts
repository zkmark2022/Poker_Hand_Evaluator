import type { Card, EquityRequest, EquityResponse } from '../types/poker'

const API_BASE = 'http://localhost:8000'

function cardToString(card: Card): string {
  const rankMap: Record<string, string> = { '10': 'T' }
  const rank = rankMap[card.rank] ?? card.rank
  const suitMap: Record<string, string> = {
    spades: 's',
    hearts: 'h',
    diamonds: 'd',
    clubs: 'c',
  }
  return `${rank}${suitMap[card.suit]}`
}

export async function calculateEquity(
  playerHoleCards: [Card, Card][],
  communityCards: Card[],
): Promise<EquityResponse> {
  const body: EquityRequest = {
    players: playerHoleCards.map((hc) => ({
      hole_cards: [cardToString(hc[0]), cardToString(hc[1])],
    })),
    community_cards: communityCards.map(cardToString),
  }

  const res = await fetch(`${API_BASE}/api/calculate-equity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`)
  }

  return res.json() as Promise<EquityResponse>
}
