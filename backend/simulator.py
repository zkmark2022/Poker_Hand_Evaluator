from __future__ import annotations

import random

from cards import Card, Deck
from evaluator import best_hand


def _normalize_cards(items: list[str] | list[Card]) -> list[Card]:
    cards = [item if isinstance(item, Card) else Card.from_str(item) for item in items]
    if len(cards) != len(set(cards)):
        raise ValueError("duplicate cards are not allowed")
    return cards


def simulate_equity(
    players: list[list[str] | list[Card]],
    board: list[str] | list[Card] | None = None,
    iterations: int = 1000,
    rng: random.Random | None = None,
) -> tuple[list[float], int]:
    if len(players) != 3:
        raise ValueError("exactly three players are required")
    if iterations <= 0:
        raise ValueError("iterations must be positive")

    normalized_players = [_normalize_cards(hand) for hand in players]
    if any(len(hand) != 2 for hand in normalized_players):
        raise ValueError("each player must have exactly two cards")

    normalized_board = _normalize_cards(board or [])
    if len(normalized_board) > 5:
        raise ValueError("board can have at most five cards")

    used_cards = [card for hand in normalized_players for card in hand] + normalized_board
    if len(used_cards) != len(set(used_cards)):
        raise ValueError("duplicate cards are not allowed")

    random_source = rng or random.Random()
    wins = [0.0, 0.0, 0.0]
    cards_needed = 5 - len(normalized_board)

    for _ in range(iterations):
        deck = Deck(excluded=used_cards)
        deck.shuffle(random_source)
        future_board = normalized_board + deck.deal(cards_needed)
        scores = [best_hand(hand + future_board) for hand in normalized_players]
        best_score = max(scores)
        winners = [index for index, score in enumerate(scores) if score == best_score]
        share = 1.0 / len(winners)
        for winner in winners:
            wins[winner] += share

    equities = [round(win / iterations * 100, 2) for win in wins]
    return equities, iterations
