from evaluator import calculate_outs, evaluate_current_hand


def test_evaluate_current_hand_detects_made_hand() -> None:
    assert (
        evaluate_current_hand(["As", "Ad"], ["Ac", "Ks", "Kd"])
        == "Full House"
    )


def test_evaluate_current_hand_supports_preflop_pairs() -> None:
    assert evaluate_current_hand(["Qs", "Qd"], []) == "One Pair"
    assert evaluate_current_hand(["As", "Kd"], []) == "High Card"


def test_evaluate_current_hand_detects_royal_flush() -> None:
    assert (
        evaluate_current_hand(["As", "Ks"], ["Qs", "Js", "Ts"])
        == "Royal Flush"
    )


def test_calculate_outs_counts_flush_draw() -> None:
    outs = calculate_outs(["As", "8s"], ["2s", "7s", "Kd"])
    assert outs["flush"] == 9
