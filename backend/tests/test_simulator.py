import random

from simulator import simulate_equity


def test_complete_board_returns_deterministic_result() -> None:
    equities, simulations = simulate_equity(
        players=[["As", "Ad"], ["Ks", "Kd"], ["Qs", "Qd"]],
        board=["2c", "3d", "7h", "9s", "Jc"],
        iterations=100,
        rng=random.Random(7),
    )
    assert simulations == 100
    assert equities == [100.0, 0.0, 0.0]


def test_partial_board_returns_valid_distribution() -> None:
    equities, simulations = simulate_equity(
        players=[["As", "Kh"], ["Qd", "Jc"], ["Ts", "9s"]],
        board=["Ah", "Kd", "5c"],
        iterations=300,
        rng=random.Random(11),
    )
    assert simulations == 300
    assert round(sum(equities), 2) == 100.0
    assert equities[0] > equities[1]
