from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from simulator import simulate_equity


app = FastAPI(title="Poker Equity Calculator")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class EquityRequest(BaseModel):
    players: list[list[str]]
    board: list[str] = Field(default_factory=list)
    iterations: int = 1000


class WinningHandStat(BaseModel):
    hand: str
    probability: float


class PlayerEquity(BaseModel):
    equity: float
    currentHand: str
    winningHands: list[WinningHandStat]


class EquityResponse(BaseModel):
    equities: list[float]
    simulations: int
    players: list[PlayerEquity]


@app.post("/api/calculate-equity", response_model=EquityResponse)
def calculate_equity(payload: EquityRequest) -> EquityResponse:
    try:
        equities, simulations, players = simulate_equity(
            players=payload.players,
            board=payload.board,
            iterations=min(payload.iterations, 10000),
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return EquityResponse(equities=equities, simulations=simulations, players=players)
