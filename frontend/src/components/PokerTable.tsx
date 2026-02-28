import { usePokerGame } from '../hooks/usePokerGame'
import PlayerHand from './PlayerHand'
import CommunityCards from './CommunityCards'
import EquityBar from './EquityBar'

const STREET_LABELS: Record<string, string> = {
  preflop: 'Pre-Flop',
  flop: 'Flop',
  turn: 'Turn',
  river: 'River',
}

const NEXT_STREET_LABELS: Record<string, string> = {
  preflop: 'Deal Flop',
  flop: 'Deal Turn',
  turn: 'Deal River',
  river: 'Showdown',
}

export default function PokerTable() {
  const { state, dealNext, reset } = usePokerGame()
  const { players, communityCards, street, isCalculating } = state

  const isRiver = street === 'river'

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <h1 className="text-center text-white text-2xl font-bold tracking-widest uppercase">
          Poker Equity Trainer
        </h1>

        <div
          className="relative rounded-[80px] border-8 border-amber-900 shadow-2xl overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at center, #1a6b3c 60%, #145230 100%)',
            minHeight: '560px',
          }}
        >
          <div className="absolute inset-4 rounded-[72px] border-2 border-green-700/40 pointer-events-none" />

          <div className="absolute top-6 left-0 right-0 flex justify-center">
            <PlayerHand player={players[0]} position="top" isCalculating={isCalculating} />
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-green-200/70 text-xs font-semibold tracking-widest uppercase">
              {STREET_LABELS[street]}
            </span>
            <CommunityCards cards={communityCards} />
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-around px-6">
            <PlayerHand player={players[1]} position="bottom-left" isCalculating={isCalculating} />
            <PlayerHand player={players[2]} position="bottom-right" isCalculating={isCalculating} />
          </div>
        </div>

        <EquityBar
          players={players.map((p) => ({ name: p.name, equity: p.equity ?? 0 }))}
          isCalculating={isCalculating}
        />

        <div className="flex gap-4 justify-center">
          <button
            onClick={dealNext}
            disabled={isRiver || isCalculating}
            className="px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            {NEXT_STREET_LABELS[street]}
          </button>
          <button
            onClick={reset}
            disabled={isCalculating}
            className="px-6 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            New Hand
          </button>
        </div>
      </div>
    </div>
  )
}
