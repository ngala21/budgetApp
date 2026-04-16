const totalAmount = document.getElementById("total-amount");
const userAmount = document.getElementById("user-amount");
const checkAmountButton = document.getElementById("check-amount");
const totalAmountButton = document.getElementById("total-amount-button");
const productTitle = document.getElementById("product-title");
const errorMessage = document.getElementById("budget-error");
const productTitleError = document.getElementById("product-title-error");
const amount = document.getElementById("amount");
const expenditureValue = document.getElementById("expenditure-value");
const balanceValue = document.getElementById("balance-amount");
const list = document.getElementById("list");

// This variable stores the row currently being edited
let editTarget = null;

// --- 1. Salary Logic ---
totalAmountButton.addEventListener("click", () => {
  let tempAmount = totalAmount.value;
  if (tempAmount === "" || tempAmount < 0) {
    errorMessage.classList.remove("hide");
  } else {
    errorMessage.classList.add("hide");
    amount.innerText = tempAmount;
    updateTotals();
    totalAmount.value = "";
  }
});

// --- 2. Centralized Total Calculation ---
// This function looks at every item in your list and updates the UI
const updateTotals = () => {
  let totalExpenses = 0;
  const allExpenseAmounts = document.querySelectorAll(".amount");

  allExpenseAmounts.forEach((item) => {
    totalExpenses += parseInt(item.innerText);
  });

  expenditureValue.innerText = totalExpenses;
  balanceValue.innerText = parseInt(amount.innerText) - totalExpenses;
};

// --- 3. Edit & Delete Logic ---
const modifyElement = (element, edit = false) => {
  let parentDiv = element.parentElement;

  if (edit) {
    // Fill the top inputs with the current row's data
    productTitle.value = parentDiv.querySelector(".product").innerText;
    userAmount.value = parentDiv.querySelector(".amount").innerText;

    // Set this row as our "target" so we know which one to update later
    editTarget = parentDiv;

    // Change button text so you know you are in "Edit Mode"
    checkAmountButton.innerText = "Update Expense";

    // Optional: Highlight the row being edited
    document
      .querySelectorAll(".sublist-content")
      .forEach((el) => (el.style.borderLeft = "none"));
    parentDiv.style.borderLeft = "5px solid #2ecc71";
  } else {
    // Delete logic
    parentDiv.remove();
    updateTotals();
  }
};

// --- 4. List Creation ---
const listCreator = (expenseName, expenseValue) => {
  let sublistContent = document.createElement("div");
  sublistContent.classList.add("sublist-content", "flex-space");

  sublistContent.innerHTML = `
    <p class="product">${expenseName}</p>
    <p class="amount">${expenseValue}</p>
  `;

  // Create Edit Button
  let editButton = document.createElement("button");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit");
  editButton.addEventListener("click", () => modifyElement(editButton, true));

  // Create Delete Button
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("fa-solid", "fa-trash-can", "delete");
  deleteButton.addEventListener("click", () => modifyElement(deleteButton));

  sublistContent.appendChild(editButton);
  sublistContent.appendChild(deleteButton);
  list.appendChild(sublistContent);
};

// --- 5. Save / Update Expense Button ---
checkAmountButton.addEventListener("click", () => {
  // Validate inputs
  if (!userAmount.value || !productTitle.value) {
    productTitleError.classList.remove("hide");
    return;
  }
  productTitleError.classList.add("hide");

  if (editTarget) {
    // MODE: UPDATE (Editing an existing row)
    editTarget.querySelector(".product").innerText = productTitle.value;
    editTarget.querySelector(".amount").innerText = userAmount.value;
    editTarget.style.borderLeft = "none"; // Remove highlight

    // Reset back to "Normal Mode"
    editTarget = null;
    checkAmountButton.innerText = "Save Expense";
  } else {
    // MODE: NEW (Creating a fresh row)
    listCreator(productTitle.value, userAmount.value);
  }

  // Sync the Salary/Expense/Balance totals
  updateTotals();

  // Clear inputs
  productTitle.value = "";
  userAmount.value = "";
});
