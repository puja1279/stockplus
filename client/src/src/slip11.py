from tkinter as ik
import math
def is_prime(n):
    if n<=1:
        return False
    for i in range(2,int(math.sqrt(n))+1):
        if n%i==0:
            return False
        return True
def is_perfect(n):
    if n<=1:
        return False
    divisors_sum=1
    for i in range(2,int(math.sqrt(n))+1):
        if n%i==0:
            divisors_sum+=n//i
        if i*i!=n:
            divisors_sum+=n//i
        return divisors_sum==n
    def is_armstrong(n):
        if n<0:
            return False
        num_str=str(n)
        num_digits=len(num_str)
        for digit in num_str:
            armstrong_sum==n
            def check_number():
                try:
                    num=int(entry_number.get())
                    selected_option=radio_var.get()
                    result_text=""
                    if selected_option==1:
                        if is_prime(num):
                            result_text=f"{num}is a Prime number."
                        else:
                            result_text=f"{num}is not a prime number"
                    elif selected_option==2:
                        if is_perfect(num):
                            result_text=f"{num}is a parfecr number"
                        else:
                            result_text=f"{num}is not a parfect number"
                    elif selected_option==3:
                        if is_armstrong(num):
                            result_text=f"{num}is an Armstong number"
                        else:
                            result_text=f"{num}is not an Armstong number"
                            label_result.coonfig(text=result_text)
                except ValueError:
                    label_result.config(text="Please enter a valid integer")
root=tk.Tk()
root.title("number cheker")
label_input=tk.Label(root,text="Enter a number")
label_input.pack(pady=10)
entry_number=tk.ENtry(root)
entry_number.pack(pady=5)
radio_var=tk.IntVar()
radio_var.set(1)
radio_prime=tk.Radiobutton(root,text="prime",variable=radio_var,value=1)
radio_prime.pack(anchor=tk.W)
radio_parfect

                            
    