from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from simulator import simulate_equity


app = FastAPI(title="Poker Equity Calculator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class WinningHandStat(BaseModel):
    hand: str
    probability: float


class PlayerEquity(BaseModel):
    equity: float
    current_hand: str
    winning_hands: list[WinningHandStat]


class EquityRequest(BaseModel):
    players: list[list[str]]
    board: list[str] = Field(default_factory=list)
    iterations: int = 1000


class EquityResponse(BaseModel):
    simulations: int
    players: list[PlayerEquity]


@app.post("/api/calculate-equity", response_model=EquityResponse)
def calculate_equity(payload: EquityRequest) -> EquityResponse:
    try:
        _, simulations, players_data = simulate_equity(
            players=payload.players,
            board=payload.board,
            iterations=min(payload.iterations, 10000),
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    
    return EquityResponse(
        simulations=simulations,
        players=[
            PlayerEquity(
                equity=p["equity"],
                current_hand=p["current_hand"],
                winning_hands=[
                    WinningHandStat(hand=w["hand"], probability=w["probability"])
                    for w in p["winning_hands"]
                ]
            )
            for p in players_data
        ]
    )
