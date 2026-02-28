from __future__ import annotations

import random
from collections import Counter

from cards import Card, Deck
from evaluator import best_hand, evaluate_current_hand, hand_rank_name


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
) -> tuple[list[float], int, list[dict[str, object]]]:
    if not (2 <= len(players) <= 10):
        raise ValueError("player count must be between 2 and 10")
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
    wins = [0.0] * len(players)
    winning_hands = [Counter() for _ in players]
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
            winning_hands[winner][hand_rank_name(scores[winner])] += share

    equities = [round(win / iterations * 100, 2) for win in wins]
    player_results = []
    for index, equity in enumerate(equities):
        total_wins = wins[index]
        top_winning_hands = []
        if total_wins:
            for hand_name, weighted_wins in winning_hands[index].most_common(3):
                top_winning_hands.append(
                    {
                        "hand": hand_name,
                        "probability": round(weighted_wins / total_wins * 100, 2),
                    }
                )
        player_results.append(
            {
                "equity": equity,
                "current_hand": evaluate_current_hand(normalized_players[index], normalized_board),
                "winning_hands": top_winning_hands,
            }
        )

    return equities, iterations, player_results
