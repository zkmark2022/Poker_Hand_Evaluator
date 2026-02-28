from __future__ import annotations

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from simulator import simulate_equity


app = FastAPI(title="Poker Equity Calculator")


class EquityRequest(BaseModel):
    players: list[list[str]]
    board: list[str] = Field(default_factory=list)


class EquityResponse(BaseModel):
    equities: list[float]
    simulations: int


@app.post("/api/calculate-equity", response_model=EquityResponse)
def calculate_equity(payload: EquityRequest) -> EquityResponse:
    try:
        equities, simulations = simulate_equity(
            players=payload.players,
            board=payload.board,
            iterations=1000,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return EquityResponse(equities=equities, simulations=simulations)
