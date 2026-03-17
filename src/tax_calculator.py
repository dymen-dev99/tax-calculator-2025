# Exemple simple : calcul d'impôt sur revenu fictif
def calculate_tax(income):
    if income <= 20000:
        return income * 0.1
    elif income <= 50000:
        return 2000 + (income - 20000) * 0.2
    else:
        return 2000 + 6000 + (income - 50000) * 0.3

if __name__ == "__main__":
    income = float(input("Enter your income: "))
    tax = calculate_tax(income)
    print(f"Your estimated tax: {tax:.2f}")
