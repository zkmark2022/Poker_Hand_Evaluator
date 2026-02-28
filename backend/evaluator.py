from __future__ import annotations

from collections import Counter
from itertools import combinations

from cards import Card


HandRank = tuple[int, ...]


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
