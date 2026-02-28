from cards import Card
from evaluator import best_hand, evaluate_five


def make_cards(raw_cards: list[str]) -> list[Card]:
    return [Card.from_str(card) for card in raw_cards]


def test_royal_flush_beats_straight_flush() -> None:
    royal_flush = evaluate_five(make_cards(["As", "Ks", "Qs", "Js", "Ts"]))
    straight_flush = evaluate_five(make_cards(["9h", "8h", "7h", "6h", "5h"]))
    assert royal_flush > straight_flush


def test_four_of_a_kind_beats_full_house() -> None:
    quads = evaluate_five(make_cards(["Ah", "Ad", "Ac", "As", "2d"]))
    full_house = evaluate_five(make_cards(["Kh", "Kd", "Kc", "2s", "2c"]))
    assert quads > full_house


def test_two_pair_beats_one_pair() -> None:
    two_pair = evaluate_five(make_cards(["Ah", "Ad", "Ks", "Kc", "2d"]))
    one_pair = evaluate_five(make_cards(["Qh", "Qd", "Js", "9c", "2d"]))
    assert two_pair > one_pair


def test_best_hand_selects_best_five_from_seven() -> None:
    cards = make_cards(["As", "Ks", "Qs", "Js", "Ts", "2d", "3c"])
    assert best_hand(cards) == (10,)
