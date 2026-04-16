// Selecting DOM Elements
const totalAmount = document.getElementById("total-amount");
const userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const amountDisplay = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");
const habitMessage = document.getElementById("habit-message");

// Global State
let editTarget = null;

const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
});

// --- 1. Money Habit Logic ---
const updateMoneyHabit = (balance, salary) => {
  if (salary === 0) {
    habitMessage.innerText = "";
    return;
  }

  const percentageLeft = (balance / salary) * 100;

  if (percentageLeft <= 0) {
    habitMessage.innerText = "🚨 You are a total Spendthrift! You're broke!";
    habitMessage.style.color = "#d63031";
  } else if (percentageLeft < 20) {
    habitMessage.innerText =
      "⚠️ Living on the edge! Slow down on the spending.";
    habitMessage.style.color = "#e67e22";
  } else if (percentageLeft < 50) {
    habitMessage.innerText = "📊 Doing okay, but watch those impulse buys.";
    habitMessage.style.color = "#f1c40f";
  } else {
    habitMessage.innerText = "💰 Financial Guru! Great job saving.";
    habitMessage.style.color = "#27ae60";
  }
};

// --- 2. LocalStorage Helpers ---
const saveToLocalStorage = () => {
  const expenses = [];
  document.querySelectorAll(".sublist-content").forEach((row) => {
    expenses.push({
      name: row.querySelector(".product").innerText,
      value: row.querySelector(".amount").getAttribute("data-value"),
    });
  });
  localStorage.setItem(
    "budget_salary",
    amountDisplay.getAttribute("data-value") || "0",
  );
  localStorage.setItem("budget_expenses", JSON.stringify(expenses));
};

const loadFromLocalStorage = () => {
  const savedSalary = localStorage.getItem("budget_salary") || "0";
  const savedExpenses = JSON.parse(
    localStorage.getItem("budget_expenses") || "[]",
  );

  amountDisplay.setAttribute("data-value", savedSalary);
  amountDisplay.innerText = currencyFormatter.format(savedSalary);

  savedExpenses.forEach((exp) => listCreator(exp.name, exp.value));
  updateTotals();
};

// --- 3. Centralized Total Calculation ---
const updateTotals = () => {
  let totalExpenses = 0;
  const allExpenseAmounts = document.querySelectorAll(".amount");

  allExpenseAmounts.forEach((item) => {
    totalExpenses += parseInt(item.getAttribute("data-value"));
  });

  const salary = parseInt(amountDisplay.getAttribute("data-value") || 0);
  const balance = salary - totalExpenses;

  expenditureValue.innerText = currencyFormatter.format(totalExpenses);
  balanceValue.innerText = currencyFormatter.format(balance);

  // Update the Habit Message
  updateMoneyHabit(balance, salary);

  saveToLocalStorage();
};

// --- 4. Salary Logic ---
totalAmountButton.addEventListener("click", () => {
  let val = totalAmount.value;
  if (val === "" || val < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    amountDisplay.setAttribute("data-value", val);
    amountDisplay.innerText = currencyFormatter.format(val);
    updateTotals();
    totalAmount.value = "";
  }
});

// --- 5. Edit & Delete Logic ---
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;

  if (edit) {
    productTitle.value = parentDiv.querySelector(".product").innerText;
    userAmount.value = parentDiv
      .querySelector(".amount")
      .getAttribute("data-value");
    editTarget = parentDiv;
    checkAmountButton.innerText = "Update Expense";
  } else {
    parentDiv.remove();
    updateTotals();
  }
};

// --- 6. List Creation ---
const listCreator = (name, value) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");

  sublistContent.innerHTML = `
        <p class="product">${name}</p>
        <p class="amount" data-value="${value}">${currencyFormatter.format(value)}</p>
    `;

  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.addEventListener("click", () => modifyElement(editButton, true));

  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.addEventListener("click", () => modifyElement(deleteButton));

  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  list.appendChild(sublistContent);
};

// --- 7. Save / Update Expense Button ---
checkAmountButton.addEventListener("click", () => {
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return;
  }
  productTitleError.classList.add("hide");

  if (editTarget) {
    editTarget.querySelector(".product").innerText = productTitle.value;
    const amtEl = editTarget.querySelector(".amount");
    amtEl.setAttribute("data-value", userAmount.value);
    amtEl.innerText = currencyFormatter.format(userAmount.value);

    editTarget = null;
    checkAmountButton.innerText = "Save Expense";
  } else {
    listCreator(productTitle.value, userAmount.value);
  }

  updateTotals();
  productTitle.value = "";
  userAmount.value = "";
});

window.onload = loadFromLocalStorage;
