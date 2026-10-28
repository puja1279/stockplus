import tkinter as tk
import math

# Check if number is prime
def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            return False
    return True

# Check if number is perfect
def is_perfect(n):
    if n <= 1:
        return False
    divisors_sum = 1
    for i in range(2, int(math.sqrt(n)) + 1):
        if n % i == 0:
            divisors_sum += i
            if i != n // i:
                divisors_sum += n // i
    return divisors_sum == n

# Check if number is Armstrong
def is_armstrong(n):
    if n < 0:
        return False
    num_str = str(n)
    num_digits = len(num_str)
    armstrong_sum = sum(int(digit) ** num_digits for digit in num_str)
    return armstrong_sum == n

# Function to check number based on selected option
def check_number():
    try:
        num = int(entry_number.get())
        selected_option = radio_var.get()
        result_text = ""

        if selected_option == 1:
            if is_prime(num):
                result_text = f"{num} is a Prime number."
            else:
                result_text = f"{num} is not a Prime number."
        elif selected_option == 2:
            if is_perfect(num):
                result_text = f"{num} is a Perfect number."
            else:
                result_text = f"{num} is not a Perfect number."
        elif selected_option == 3:
            if is_armstrong(num):
                result_text = f"{num} is an Armstrong number."
            else:
                result_text = f"{num} is not an Armstrong number."

        label_result.config(text=result_text)

    except ValueError:
        label_result.config(text="Please enter a valid integer")

# Tkinter UI
root = tk.Tk()
root.title("Number Checker")
root.geometry("300x300")

label_input = tk.Label(root, text="Enter a number:")
label_input.pack(pady=10)

entry_number = tk.Entry(root)
entry_number.pack(pady=5)

radio_var = tk.IntVar()
radio_var.set(1)

radio_prime = tk.Radiobutton(root, text="Prime", variable=radio_var, value=1)
radio_prime.pack(anchor=tk.W)

radio_perfect = tk.Radiobutton(root, text="Perfect", variable=radio_var, value=2)
radio_perfect.pack(anchor=tk.W)

radio_armstrong = tk.Radiobutton(root, text="Armstrong", variable=radio_var, value=3)
radio_armstrong.pack(anchor=tk.W)

btn_check = tk.Button(root, text="Check", command=check_number)
btn_check.pack(pady=10)

label_result = tk.Label(root, text="", font=("Arial", 12))
label_result.pack(pady=10)

root.mainloop()
