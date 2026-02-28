from __future__ import annotations

import random
from dataclasses import dataclass


SUITS = ("s", "h", "d", "c")
RANKS = "23456789TJQKA"
RANK_TO_VALUE = {rank: index for index, rank in enumerate(RANKS, start=2)}
VALUE_TO_RANK = {value: rank for rank, value in RANK_TO_VALUE.items()}


@dataclass(frozen=True, order=True)
class Card:
    rank: str
    suit: str

    def __post_init__(self) -> None:
        if self.rank not in RANK_TO_VALUE:
            raise ValueError(f"invalid rank: {self.rank}")
        if self.suit not in SUITS:
            raise ValueError(f"invalid suit: {self.suit}")

    @property
    def value(self) -> int:
        return RANK_TO_VALUE[self.rank]

    @classmethod
    def from_str(cls, raw: str) -> "Card":
        text = raw.strip()
        if len(text) != 2:
            raise ValueError(f"invalid card: {raw}")
        return cls(rank=text[0].upper(), suit=text[1].lower())

    def __str__(self) -> str:
        return f"{self.rank}{self.suit}"


class Deck:
    def __init__(self, excluded: list[Card] | None = None) -> None:
        excluded_set = set(excluded or [])
        self.cards = [
            Card(rank=rank, suit=suit)
            for suit in SUITS
            for rank in RANKS
            if Card(rank=rank, suit=suit) not in excluded_set
        ]

    def shuffle(self, rng: random.Random | None = None) -> None:
        (rng or random).shuffle(self.cards)

    def deal(self, count: int) -> list[Card]:
        if count < 0:
            raise ValueError("count must be non-negative")
        if count > len(self.cards):
            raise ValueError("not enough cards in deck")
        dealt = self.cards[:count]
        del self.cards[:count]
        return dealt
