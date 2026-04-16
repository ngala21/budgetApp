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

// Global State
let editTarget = null;

// Currency Formatter (Kenya Shillings example - change 'KES' to 'USD' if needed)
const currencyFormatter = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
});

// --- 1. LocalStorage Helpers ---
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

  // Restore Salary
  amountDisplay.setAttribute("data-value", savedSalary);
  amountDisplay.innerText = currencyFormatter.format(savedSalary);

  // Restore Expense List
  savedExpenses.forEach((exp) => listCreator(exp.name, exp.value));

  updateTotals();
};

// --- 2. Centralized Total Calculation ---
const updateTotals = () => {
  let totalExpenses = 0;
  const allExpenseAmounts = document.querySelectorAll(".amount");

  allExpenseAmounts.forEach((item) => {
    totalExpenses += parseInt(item.getAttribute("data-value"));
  });

  const salary = parseInt(amountDisplay.getAttribute("data-value") || 0);

  // Update UI with Formatted Currency
  expenditureValue.innerText = currencyFormatter.format(totalExpenses);
  balanceValue.innerText = currencyFormatter.format(salary - totalExpenses);

  // Save state after any change
  saveToLocalStorage();
};

// --- 3. Salary Logic ---
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

// --- 4. Edit & Delete Logic ---
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;

  if (edit) {
    productTitle.value = parentDiv.querySelector(".product").innerText;
    userAmount.value = parentDiv
      .querySelector(".amount")
      .getAttribute("data-value");
    editTarget = parentDiv;
    checkAmountButton.innerText = "Update Expense";
    parentDiv.classList.add("editing-row");
  } else {
    parentDiv.remove();
    updateTotals();
  }
};

// --- 5. List Creation ---
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

// --- 6. Save / Update Expense Button ---
checkAmountButton.addEventListener("click", () => {
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return;
  }
  productTitleError.classList.add("hide");

  if (editTarget) {
    // Update existing
    editTarget.querySelector(".product").innerText = productTitle.value;
    const amtEl = editTarget.querySelector(".amount");
    amtEl.setAttribute("data-value", userAmount.value);
    amtEl.innerText = currencyFormatter.format(userAmount.value);

    editTarget.classList.remove("editing-row");
    editTarget = null;
    checkAmountButton.innerText = "Save Expense";
  } else {
    // Create new
    listCreator(productTitle.value, userAmount.value);
  }

  updateTotals();
  productTitle.value = "";
  userAmount.value = "";
});

// Initialize app on load
window.onload = loadFromLocalStorage;
