from src.tax_calculator import calculate_tax

def test_calculate_tax():
    assert calculate_tax(10000) == 1000
    assert calculate_tax(30000) == 4000
    assert calculate_tax(60000) == 9000

if __name__ == "__main__":
    test_calculate_tax()
    print("All tests passed!")
