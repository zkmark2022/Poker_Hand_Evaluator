import random
from collections import Counter
from itertools import combinations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Poker Equity Calculator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RANKS = "23456789TJQKA"
SUITS = "shdc"
FULL_DECK: list[str] = [r + s for r in RANKS for s in SUITS]


# ---------- Request / Response models ----------

class PlayerIn(BaseModel):
    hole_cards: list[str]


class EquityRequest(BaseModel):
    players: list[PlayerIn]
    community_cards: list[str]


class PlayerEquity(BaseModel):
    win_probability: float
    tie_probability: float
    equity: float


class EquityResponse(BaseModel):
    players: list[PlayerEquity]


# ---------- Hand evaluator ----------

def _rank(card: str) -> int:
    return RANKS.index(card[0])


def _eval5(cards: list[str]) -> tuple[int, ...]:
    """Return a comparable tuple representing hand strength (higher = better)."""
    ranks = sorted([_rank(c) for c in cards], reverse=True)
    suits = [c[1] for c in cards]
    is_flush = len(set(suits)) == 1
    rc = Counter(ranks)
    sr = sorted(rc.keys(), key=lambda r: (rc[r], r), reverse=True)
    cnts = [rc[r] for r in sr]

    is_straight, sh = False, 0
    if len(rc) == 5:
        if ranks[0] - ranks[4] == 4:
            is_straight, sh = True, ranks[0]
        elif set(ranks) == {0, 1, 2, 3, 12}:  # wheel A-2-3-4-5
            is_straight, sh = True, 3

    if is_flush and is_straight:
        return (8, sh)
    if cnts[0] == 4:
        return (7, sr[0], sr[1])
    if cnts[0] == 3 and len(cnts) > 1 and cnts[1] == 2:
        return (6, sr[0], sr[1])
    if is_flush:
        return (5, *ranks)
    if is_straight:
        return (4, sh)
    if cnts[0] == 3:
        return (3, sr[0], sr[1], sr[2])
    if cnts[0] == 2 and len(cnts) > 1 and cnts[1] == 2:
        return (2, sr[0], sr[1], sr[2])
    if cnts[0] == 2:
        return (1, sr[0], sr[1], sr[2], sr[3])
    return (0, *ranks)


def _best7(cards: list[str]) -> tuple[int, ...]:
    return max(_eval5(list(combo)) for combo in combinations(cards, 5))


# ---------- Endpoint ----------

@app.post("/api/calculate-equity", response_model=EquityResponse)
def calculate_equity(req: EquityRequest) -> EquityResponse:
    used: set[str] = {c for p in req.players for c in p.hole_cards} | set(req.community_cards)
    remaining = [c for c in FULL_DECK if c not in used]
    n_needed = 5 - len(req.community_cards)
    n_players = len(req.players)
    n_sims = 1000

    win_counts = [0] * n_players
    tie_counts = [0] * n_players
    contributions = [0.0] * n_players

    for _ in range(n_sims):
        board = list(req.community_cards) + random.sample(remaining, n_needed)
        scores = [_best7(list(p.hole_cards) + board) for p in req.players]
        best = max(scores)
        winners = [i for i, s in enumerate(scores) if s == best]
        share = 1.0 / len(winners)
        if len(winners) == 1:
            win_counts[winners[0]] += 1
        else:
            for w in winners:
                tie_counts[w] += 1
        for w in winners:
            contributions[w] += share

    return EquityResponse(
        players=[
            PlayerEquity(
                win_probability=win_counts[i] / n_sims,
                tie_probability=tie_counts[i] / n_sims,
                equity=contributions[i] / n_sims,
            )
            for i in range(n_players)
        ]
    )
