import { Card } from '../types/poker'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface EquityResponse {
  equities: number[]
  simulations: number
}

export async function calculateEquity(
  players: Card[][],
  board: Card[]
): Promise<EquityResponse> {
  const toStr = (c: Card) => `${c.rank}${c.suit}`
  
  const response = await fetch(`${API_BASE}/api/calculate-equity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      players: players.map((hand) => hand.map(toStr)),
      board: board.map(toStr),
    }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  return response.json()
}
