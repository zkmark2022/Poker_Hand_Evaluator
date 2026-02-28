from __future__ import annotations

from collections import Counter
from itertools import combinations

from cards import Card, Deck


HandRank = tuple[int, ...]
HAND_NAMES = {
    1: "High Card",
    2: "One Pair",
    3: "Two Pair",
    4: "Three of a Kind",
    5: "Straight",
    6: "Flush",
    7: "Full House",
    8: "Four of a Kind",
    9: "Straight Flush",
    10: "Royal Flush",
}
HAND_KEYS = {
    "High Card": "high_card",
    "One Pair": "one_pair",
    "Two Pair": "two_pair",
    "Three of a Kind": "three_of_a_kind",
    "Straight": "straight",
    "Flush": "flush",
    "Full House": "full_house",
    "Four of a Kind": "four_of_a_kind",
    "Straight Flush": "straight_flush",
    "Royal Flush": "royal_flush",
}
HAND_STRENGTHS = {name: strength for strength, name in HAND_NAMES.items()}


def _straight_high(values: list[int]) -> int | None:
    unique = sorted(set(values), reverse=True)
    if 14 in unique:
        unique.append(1)
    for index in range(len(unique) - 4):
        window = unique[index:index + 5]
        if window[0] - window[4] == 4 and len(window) == 5:
            return window[0]
    return None


def evaluate_five(cards: list[Card]) -> HandRank:
    if len(cards) != 5:
        raise ValueError("exactly five cards required")

    values = sorted((card.value for card in cards), reverse=True)
    suits = [card.suit for card in cards]
    counts = Counter(values)
    groups = sorted(((count, value) for value, count in counts.items()), reverse=True)
    is_flush = len(set(suits)) == 1
    straight_high = _straight_high(values)

    if is_flush and straight_high == 14:
        return (10,)
    if is_flush and straight_high:
        return (9, straight_high)
    if groups[0][0] == 4:
        quad = groups[0][1]
        kicker = max(value for value in values if value != quad)
        return (8, quad, kicker)
    if groups[0][0] == 3 and groups[1][0] == 2:
        return (7, groups[0][1], groups[1][1])
    if is_flush:
        return (6, *values)
    if straight_high:
        return (5, straight_high)
    if groups[0][0] == 3:
        trips = groups[0][1]
        kickers = sorted((value for value in values if value != trips), reverse=True)
        return (4, trips, *kickers)
    if groups[0][0] == 2 and groups[1][0] == 2:
        pair_values = sorted((value for count, value in groups if count == 2), reverse=True)
        kicker = max(value for value in values if value not in pair_values)
        return (3, *pair_values, kicker)
    if groups[0][0] == 2:
        pair = groups[0][1]
        kickers = sorted((value for value in values if value != pair), reverse=True)
        return (2, pair, *kickers)
    return (1, *values)


def best_hand(cards: list[Card]) -> HandRank:
    if len(cards) != 7:
        raise ValueError("exactly seven cards required")
    return max(evaluate_five(list(combo)) for combo in combinations(cards, 5))


def hand_rank_name(rank: HandRank) -> str:
    return HAND_NAMES[rank[0]]


def _normalize_cards(items: list[str] | list[Card]) -> list[Card]:
    cards = [item if isinstance(item, Card) else Card.from_str(item) for item in items]
    if len(cards) != len(set(cards)):
        raise ValueError("duplicate cards are not allowed")
    return cards


def _partial_hand_name(cards: list[Card]) -> str:
    counts = Counter(card.value for card in cards)
    pair_count = sum(1 for count in counts.values() if count == 2)
    max_count = max(counts.values(), default=0)

    if max_count == 4:
        return "Four of a Kind"
    if max_count == 3:
        return "Three of a Kind"
    if pair_count >= 2:
        return "Two Pair"
    if pair_count == 1:
        return "One Pair"
    return "High Card"


def evaluate_current_hand(
    hole_cards: list[str] | list[Card],
    board: list[str] | list[Card],
) -> str:
    normalized_hole = _normalize_cards(hole_cards)
    normalized_board = _normalize_cards(board)
    if len(normalized_hole) != 2:
        raise ValueError("hole cards must contain exactly two cards")
    if len(normalized_board) > 5:
        raise ValueError("board can have at most five cards")

    cards = normalized_hole + normalized_board
    if len(cards) != len(set(cards)):
        raise ValueError("duplicate cards are not allowed")

    if len(cards) < 5:
        return _partial_hand_name(cards)
    if len(cards) == 5:
        return hand_rank_name(evaluate_five(cards))
    if len(cards) == 6:
        return hand_rank_name(max(evaluate_five(list(combo)) for combo in combinations(cards, 5)))
    return hand_rank_name(best_hand(cards))


def calculate_outs(
    hole_cards: list[str] | list[Card],
    board: list[str] | list[Card],
) -> dict[str, int]:
    normalized_hole = _normalize_cards(hole_cards)
    normalized_board = _normalize_cards(board)
    if len(normalized_hole) != 2:
        raise ValueError("hole cards must contain exactly two cards")
    if len(normalized_board) > 5:
        raise ValueError("board can have at most five cards")
    if len(normalized_board) == 5:
        return {}

    used_cards = normalized_hole + normalized_board
    if len(used_cards) != len(set(used_cards)):
        raise ValueError("duplicate cards are not allowed")

    current_strength = HAND_STRENGTHS[evaluate_current_hand(normalized_hole, normalized_board)]
    outs = Counter()

    for next_card in Deck(excluded=used_cards).cards:
        future_hand = evaluate_current_hand(normalized_hole, normalized_board + [next_card])
        future_strength = HAND_STRENGTHS[future_hand]
        if future_strength > current_strength:
            outs[HAND_KEYS[future_hand]] += 1

    return dict(outs.most_common())
