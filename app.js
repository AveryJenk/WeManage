// Checks our JS is working in browser
console.log("App is working!");


class Task { // Task class (Carson)
  constructor(name, description, deadline, priority, completedState) {
    this.name = name;
    this.description = description;
    this.deadline = deadline;
    this.priority = priority;
    this.completed = completedState;
  }
}

let taskList = []; // Holds all task objects (Kaylynn)
const todoList = document.getElementById("todoList"); // To Do List container (Kaylynn)
const completedList = document.getElementById("completedList"); // Completed List container (Kaylynn)
const modalAddButton = document.querySelector("#addTaskModal .skillAdd"); // Add Task button inside modal (Carson)
const modalTaskName = document.getElementById("taskInputName"); // Task Name input (Kaylynn)
const modalTaskDesc = document.getElementById("taskInputDescription"); // Task Description input (Kaylynn)
const modalDeadline = document.getElementById("deadlineInput"); // Task Deadline input (Kaylynn)
const modalPriority = document.getElementById("priorityRange"); // Task Priority input (Kaylynn)
let taskBeingEdited = null; // Track which task is being edited (Carson)


// FUNCTIONS
function addTask() { // Adds a new task (Avery)
  const name = modalTaskName.value.trim();
  const description = modalTaskDesc.value.trim();
  const deadline = modalDeadline.value || "TBD";
  const priority = modalPriority.value;

  if (!name) return; // Don't add if name is empty

  if (taskBeingEdited) {
    editTask(name, description, deadline, priority);
  } else {
    const newTask = document.createElement("li");
    newTask.className = "list-group-item list-group-item-action";
    newTask.innerHTML = `
      <div class="d-flex justify-content-between align-items-center w-100">
        <div>
          <strong>📋 ${name}</strong><br>
          <small>${description}</small>
        </div>
        <div class="text-end">
          <span class="fs-6">📅 ${deadline} |‼️ ${priority}</span>
          <div class="dropdown d-inline ms-2">
            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">⚙️</button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item edit-task" href="#">✏️ Edit</a></li>
              <li><a class="dropdown-item delete-task" href="#">❌ Delete</a></li>
              <li><a class="dropdown-item complete-task" href="#">✅ Complete</a></li>
            </ul>
          </div>
        </div>
      </div>
    `;

    todoList.appendChild(newTask);

    const taskObj = new Task(name, description, deadline, priority, false);
    taskList.push(taskObj);
    newTask.dataset.taskId = taskList.length - 1;

    setupTaskListeners(newTask); // Set up dropdown actions (Carson)
    localStorage.setItem('taskListKey', JSON.stringify(taskList));
  }

  resetModal(); // Clear modal after adding task (Carson)
}

function editTask(name, description, deadline, priority) { // Edits an existing task (Avery)
  taskBeingEdited.querySelector("strong").innerText = `📋 ${name}`;
  taskBeingEdited.querySelector("small").innerText = description;
  taskBeingEdited.querySelector(".fs-6").innerText = `📅 ${deadline} |‼️ ${priority}`;

  const id = taskBeingEdited.dataset.taskId;
  if (taskList[id]) {
    taskList[id].name = name;
    taskList[id].description = description;
    taskList[id].deadline = deadline;
    taskList[id].priority = priority;
  }

  taskBeingEdited = null;
  localStorage.setItem('taskListKey', JSON.stringify(taskList));
  resetModal();
}

function openTaskModal(task) { // Opens the "View Task" modal (Avery)
  const modal = new bootstrap.Modal(document.getElementById('taskModal'));
  const now = new Date();
  const deadlineDate = new Date(task.deadline);

  document.getElementById('viewTaskModalLabel').textContent = task.name;
  document.getElementById('taskModalDeadlineState').textContent = task.completed ? 'Completed' : (deadlineDate < now ? 'Overdue' : 'Ongoing');

  const modalBody = document.querySelector('#taskModal .modal-body');
  modalBody.innerHTML = `
    <p>${task.description}</p>
    <hr>
    <p>Priority: ${task.priority}/10</p>
    <p>Deadline: ${task.deadline === "TBD" ? "No deadline" : task.deadline}</p>
  `;

  modal.show();
}

function initializeTasks(task, id) { // Rebuilds tasks from localStorage (Avery)
  const newTask = document.createElement("li");
  newTask.className = `list-group-item list-group-item-action ${task.completed ? 'completed' : ''}`;
  newTask.innerHTML = `
    <div class="d-flex justify-content-between align-items-center w-100">
      <div>
        <strong>📋 ${task.name}</strong><br>
      </div>
      <div class="text-end">
        <span class="fs-6">📅 ${task.deadline} |‼️ ${task.priority}</span>
        <div class="dropdown d-inline ms-2">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">⚙️</button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item edit-task" href="#">✏️ Edit</a></li>
            <li><a class="dropdown-item delete-task" href="#">❌ Delete</a></li>
            <li><a class="dropdown-item complete-task" href="#">✅ Complete</a></li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const targetList = task.completed ? completedList : todoList;
  targetList.appendChild(newTask);
  newTask.dataset.taskId = id;

  setupTaskListeners(newTask);
}

function setupTaskListeners(newTask) { // Adds event listeners to each task (Carson)
  newTask.querySelector(".dropdown-toggle").addEventListener("click", (e) => e.stopPropagation());

  newTask.querySelector(".delete-task").addEventListener("click", (e) => {
    e.stopPropagation();
    const id = newTask.dataset.taskId;
    taskList[id] = null;
    newTask.remove();
    localStorage.setItem('taskListKey', JSON.stringify(taskList));
  });

  newTask.querySelector(".complete-task").addEventListener("click", (e) => {
    e.stopPropagation();
    const id = newTask.dataset.taskId;
    if (taskList[id]) taskList[id].completed = true;
    newTask.classList.add("completed");
    completedList.appendChild(newTask);
    localStorage.setItem('taskListKey', JSON.stringify(taskList));
  });

  newTask.querySelector(".edit-task").addEventListener("click", (e) => {
    e.stopPropagation();
    taskBeingEdited = newTask;

    const taskTitle = newTask.querySelector("strong").innerText.replace("📋 ", "");
    const taskDesc = newTask.querySelector("small").innerText;
    const taskMeta = newTask.querySelector(".fs-6").innerText;
    const deadlineMatch = taskMeta.match(/📅 (.*?) \|/);
    const priorityMatch = taskMeta.match(/‼️\s*(.*)/);

    modalTaskName.value = taskTitle;
    modalTaskDesc.value = taskDesc;
    modalDeadline.value = deadlineMatch ? deadlineMatch[1] : "";
    modalPriority.value = priorityMatch ? priorityMatch[1] : "5";

    const modal = new bootstrap.Modal(document.getElementById("addTaskModal"));
    modal.show();
  });
}

function resetModal() { // Resets modal input fields after task submission (Carson)
  modalTaskName.value = "";
  modalTaskDesc.value = "";
  modalDeadline.value = "";
  modalPriority.value = "5";
  const modalInstance = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
  if (modalInstance) modalInstance.hide();
}

function searchTasks() { // Task Search Function with Highlight and Smooth Scroll (Kaylynn)
  const searchInput = document.getElementById('skillSearch');
  const filter = searchInput.value.trim().toLowerCase();

  const allTasks = document.querySelectorAll('#todoList .list-group-item, #completedList .list-group-item');
  let firstMatch = null;

  allTasks.forEach(task => {
    const titleElement = task.querySelector('strong');
    if (!titleElement) return;

    const originalText = titleElement.textContent.replace('📋', '').trim();
    const lowerOriginalText = originalText.toLowerCase();

    if (lowerOriginalText.includes(filter) && filter !== "") {
      task.style.display = '';
      const highlightedText = originalText.replace(new RegExp(filter, 'gi'), (match) => `<mark>${match}</mark>`);
      titleElement.innerHTML = `📋 ${highlightedText}`;

      if (!firstMatch) {
        firstMatch = task;
      }
    } else if (filter === "") {
      task.style.display = '';
      titleElement.innerHTML = `📋 ${originalText}`;
    } else {
      task.style.display = 'none';
      titleElement.innerHTML = `📋 ${originalText}`;
    }
  });

  // After highlighting, scroll smoothly to match
  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}


// DOMContentLoaded Event (Kaylynn) this makes the task added be found when searched for 
document.addEventListener("DOMContentLoaded", function () {
  console.log('This is working!');

  modalAddButton.addEventListener("click", addTask);
  document.getElementById('skillSearch').addEventListener('input', searchTasks);

  const storedtaskList = localStorage.getItem('taskListKey');
  if (storedtaskList) {
    taskList = JSON.parse(storedtaskList).filter(t => t !== null);
    todoList.innerHTML = '';
    completedList.innerHTML = '';

    taskList = taskList.map((task, index) => {
      const newTask = { ...task, id: index };
      initializeTasks(newTask, index);
      return newTask;
    });
  }
});
