


'use strict';

// Select all DOM elements
const headerTime = document.querySelector("[data-header-time]");
const menuTogglers = document.querySelectorAll("[data-menu-toggler]");
const menu = document.querySelector("[data-menu]");
const themeBtns = document.querySelectorAll("[data-theme-btn]");
const modalTogglers = document.querySelectorAll("[data-modal-toggler]");
const welcomeNote = document.querySelector("[data-welcome-note]");
const taskList = document.querySelector("[data-task-list]");
const taskInput = document.querySelector("[data-task-input]");
const prioritySelect = document.querySelector("[data-priority-select]"); // Add priority selection
const modal = document.querySelector("[data-info-modal]");

// Import task complete sound
const taskCompleteSound = new Audio("./assets/sounds/task-complete.mp3");

// Store current date from the built-in Date object
const date = new Date();

// Get weekday name
const getWeekDayName = function (dayNumber) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayNumber] || "Not a valid day";
}

// Get month name
const getMonthName = function (monthNumber) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[monthNumber] || "Not a valid month";
}

// Store weekday name, month name & day of the month
const weekDayName = getWeekDayName(date.getDay());
const monthName = getMonthName(date.getMonth());
const monthOfDay = date.getDate();

// Update header time date
headerTime.textContent = `${weekDayName}, ${monthName} ${monthOfDay}`;

// Toggle active class on element
const elemToggler = function (elem) {
  elem.classList.toggle("active");
}

// Add event to multiple elements
const addEventOnMultiElem = function (elems, event) {
  elems.forEach(elem => elem.addEventListener("click", event));
}

// Create task item and return it, with priority
const taskItemNode = function (taskText, priority) {
  const createTaskItem = document.createElement("li");
  createTaskItem.classList.add("task-item", priority);
  createTaskItem.setAttribute("data-task-item", "");

  createTaskItem.innerHTML = `
    <button class="item-icon" data-task-remove="complete">
      <span class="check-icon"></span>
    </button>
    <p class="item-text">${taskText} (${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority)</p>
    <button class="item-action-btn" aria-label="Remove task" data-task-remove>
      <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
    </button>
  `;

  return createTaskItem;
}

// Load tasks from local storage
const loadTasks = function () {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    const taskItem = taskItemNode(task.text, task.priority);
    taskList.appendChild(taskItem);
  });
  updateTaskItems(); // Add event listeners to loaded tasks
}

// Save tasks to local storage
const saveTasks = function () {
  const tasks = [];
  document.querySelectorAll("[data-task-item]").forEach(item => {
    const taskText = item.querySelector(".item-text").textContent;
    const priority = Array.from(item.classList).find(cls => cls !== 'task-item');
    tasks.push({ text: taskText.split(" (")[0], priority }); // Store task without priority in the text
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Task input validation
const taskInputValidation = function (taskIsValid) {
  if (taskIsValid) {
    const selectedPriority = prioritySelect.value; // Get selected priority
    const newTaskItem = taskItemNode(taskInput.value, selectedPriority); // Create the new task item
    taskList.appendChild(newTaskItem); // Append the new task
    taskInput.value = ""; // Clear the input
    prioritySelect.value = "medium"; // Reset to default priority
    removeWelcomeNote(); // Hide the welcome note
    updateTaskItems(); // Update task items with event listeners
    saveTasks(); // Save tasks to local storage
  } else {
    console.log("Please write something!");
  }
}

// Remove welcome note if there are tasks
const removeWelcomeNote = function () {
  if (taskList.childElementCount > 0) {
    welcomeNote.classList.add("hide");
  } else {
    welcomeNote.classList.remove("hide");
  }
}

// Remove task when clicked
const removeTask = function () {
  const parentElement = this.closest("[data-task-item]"); // Get the parent task item
  parentElement.classList.add("complete"); // Add "complete" class

  if (this.dataset.taskRemove === "complete") {
    taskCompleteSound.play(); // Play sound when task is marked complete
    setTimeout(function () {
      parentElement.remove(); // Remove task item after delay
      removeWelcomeNote();
      saveTasks(); // Save tasks after removal
    }, 250);
  } else {
    parentElement.remove(); // Immediate removal for trash button
    removeWelcomeNote();
    saveTasks(); // Save tasks after removal
  }
}

// Add task function
const addTask = function () {
  taskInputValidation(taskInput.value);
}

// Add event listeners to task items
const updateTaskItems = function () {
  const taskRemover = document.querySelectorAll("[data-task-remove]");
  addEventOnMultiElem(taskRemover, removeTask);
}

// Add keypress listener on taskInput
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTask();
  }
});

// Toggle active class on menu
const toggleMenu = function () { elemToggler(menu); }
addEventOnMultiElem(menuTogglers, toggleMenu);

// Toggle active class on modal
const toggleModal = function () { elemToggler(modal); }
addEventOnMultiElem(modalTogglers, toggleModal);

// Load tasks on page load
window.addEventListener("load", function () {
  document.body.classList.add("loaded");
  loadTasks(); // Load tasks from local storage
});

// Change body background when clicking on any themeBtn
const themeChanger = function () {
  const hueValue = this.dataset.hue;
  document.documentElement.style.setProperty("--hue", hueValue);
  themeBtns.forEach(btn => btn.classList.remove("active"));
  this.classList.add("active");
}
addEventOnMultiElem(themeBtns, themeChanger);
