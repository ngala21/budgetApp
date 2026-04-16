// KshFlow - Smart Budget Tracker
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

// Currency Formatter for Kenya Shillings
const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  minimumFractionDigits: 0, // Keeps it clean for friends
});

// --- 1. Money Habit Logic ---
const updateMoneyHabit = (balance, salary) => {
  if (salary <= 0) {
    habitMessage.innerText = "Set your salary to start tracking!";
    habitMessage.style.color = "#888";
    return;
  }

  const percentageLeft = (balance / salary) * 100;

  if (percentageLeft <= 0) {
    habitMessage.innerText =
      "🚨 Status: Spendthrift! You are officially broke.";
    habitMessage.style.color = "#d63031";
  } else if (percentageLeft < 20) {
    habitMessage.innerText =
      "⚠️ Status: Living on the Edge! Put the wallet down.";
    habitMessage.style.color = "#e67e22";
  } else if (percentageLeft < 50) {
    habitMessage.innerText = "📊 Status: Budgeting. Watch those impulse buys.";
    habitMessage.style.color = "#f1c40f";
  } else {
    habitMessage.innerText =
      "💰 Status: Financial Guru! Your savings are safe.";
    habitMessage.style.color = "#27ae60";
  }
};

// --- 2. LocalStorage Logic ---
const saveToKshFlow = () => {
  const expenses = [];
  document.querySelectorAll(".sublist-content").forEach((row) => {
    expenses.push({
      name: row.querySelector(".product").innerText,
      value: row.querySelector(".amount").getAttribute("data-value"),
    });
  });
  localStorage.setItem(
    "kshflow_salary",
    amountDisplay.getAttribute("data-value") || "0",
  );
  localStorage.setItem("kshflow_expenses", JSON.stringify(expenses));
};

const loadFromKshFlow = () => {
  const savedSalary = localStorage.getItem("kshflow_salary") || "0";
  const savedExpenses = JSON.parse(
    localStorage.getItem("kshflow_expenses") || "[]",
  );

  amountDisplay.setAttribute("data-value", savedSalary);
  amountDisplay.innerText = currencyFormatter.format(savedSalary);

  savedExpenses.forEach((exp) => listCreator(exp.name, exp.value));
  updateTotals();
};

// --- 3. UI Update Engine ---
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

  updateMoneyHabit(balance, salary);
  saveToKshFlow();
};

// --- 4. Event Listeners ---

// Save Salary
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

// Add / Update Expense
checkAmountButton.addEventListener("click", () => {
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return;
  }
  productTitleError.classList.add("hide");

  if (editTarget) {
    // Edit Mode
    editTarget.querySelector(".product").innerText = productTitle.value;
    const amtEl = editTarget.querySelector(".amount");
    amtEl.setAttribute("data-value", userAmount.value);
    amtEl.innerText = currencyFormatter.format(userAmount.value);

    editTarget.style.borderLeft = "none";
    editTarget = null;
    checkAmountButton.innerText = "Save Expense";
  } else {
    // New Expense Mode
    listCreator(productTitle.value, userAmount.value);
  }

  updateTotals();
  productTitle.value = "";
  userAmount.value = "";
});

// --- 5. List Management ---
const listCreator = (name, value) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");

  sublistContent.innerHTML = `
        <p class="product">${name}</p>
        <p class="amount" data-value="${value}">${currencyFormatter.format(value)}</p>
    `;

  // Edit
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.addEventListener("click", () => {
    productTitle.value = name;
    userAmount.value = value;
    editTarget = sublistContent;
    checkAmountButton.innerText = "Update Expense";
    sublistContent.style.borderLeft = "4px solid #5858e8";
  });

  // Delete
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.addEventListener("click", () => {
    sublistContent.remove();
    updateTotals();
  });

  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  list.appendChild(sublistContent);
};

// Initial Load
window.onload = loadFromKshFlow;
