// console.log("Hello World");
const errorMessage = document.getElementById("salaryError");
const expenditureValue = document.getElementById("rightAmount");
const balanceValue = document.getElementById("balance");
// Salary Column
document.getElementById("saveSalary").onclick = () => {
  let Salary = document.getElementById("salary").value;

  // empty or negative input
  if (Salary === "" || Salary < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
  }

  amount.innerHTML = Salary;

  // Set Balance
  balanceValue.innerText = Salary - expenditureValue.innerText;
};

// document.getElementById();

// Expense Column
document.getElementById("saveExpense").onclick = () => {
  let Expense = document.getElementById("rightName").value;
  let expenditureValue = document.getElementById("rightAmount").value;

  document.getElementById("expenseHeading").innerText = Expense;
  document.getElementById("expenseTitle").innerText = expenditureValue;
};

// console.log(Expense);
// console.log(Amount);
