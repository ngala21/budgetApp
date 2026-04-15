// console.log("Hello World");

// Salary Column
document.getElementById("saveSalary").onclick = () => {
  let Salary = document.getElementById("salary").value;

  document.getElementById("salario").innerText = Salary;
};

// document.getElementById();

// Expense Column
document.getElementById("saveExpense").onclick = () => {
  let Expense = document.getElementById("rightName").value;
  let Amount = document.getElementById("rightAmount").value;

  document.getElementById("expenseHeading").innerText = Expense;
  document.getElementById("expenseTitle").innerText = Amount;
};

// console.log(Expense);
// console.log(Amount);
