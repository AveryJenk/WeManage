console.log("App is working!");

let currentEditedTask = [];
const todoList = document.getElementById("todoList");
const completedList = document.getElementById("completedList");
const modalAddButton = document.querySelector("#addTaskModal .skillAdd");
const modalEditButton = document.getElementById("editTask");
const modalTaskName = document.getElementById("taskInputName");
const modalTaskDesc = document.getElementById("taskInputDescription");
const modalDeadline = document.getElementById("deadlineInput");
const modalPriority = document.getElementById("priorityRange");
const modalEditTaskName = document.getElementById("taskEditName");
const modalEditTaskDesc = document.getElementById("taskEditDescription");
const modalEditDeadline = document.getElementById("deadlineEdit");
const modalEditPriority = document.getElementById("priorityRangeEdit");
let taskBeingEdited = null; // Track which task is being edited

document.addEventListener("DOMContentLoaded", function () {
  modalAddButton.addEventListener("click", addTask);
  modalEditButton.addEventListener("click", editTask);

  console.log('This is working!');
  const storedtaskList = localStorage.getItem('taskListKey');
  if (storedtaskList) {
    taskList = JSON.parse(storedtaskList).filter(t => t !== null); // Remove null entries
    
    // Clear lists
    todoList.innerHTML = '';
    completedList.innerHTML = '';

    // Rebuild task list with proper indexes
    taskList = taskList.map((task, index) => {
      const newTask = { ...task, id: index }; // Create new ID system
      initializeTasks(newTask, index);
      return newTask;
      
      
    });
  }
});

//Initialize the task class for caching
class Task {
  constructor(name, description, deadline, priority, completedState) {
      this.name = name;
      this.description = description;
      this.deadline = deadline;
      this.priority = priority;
      this.completed = completedState;
  }
}
let taskNum = 0; //Allows for dynamic task naming numerically
let taskList = []; // This will store all our task objects

function addTask() {
  const name = modalTaskName.value.trim();
  const description = modalTaskDesc.value.trim();
  const deadline = modalDeadline.value || "TBD";
  const priority = modalPriority.value;

  if (name) {
    const taskObj = new Task(name, description, deadline, priority, false);
    taskList.push(taskObj);

    // Clear and re-render the task list
    renderTasks();

    // Reset modal input fields
    modalTaskName.value = "";
    modalTaskDesc.value = "";
    modalDeadline.value = "";
    modalPriority.value = "5";

    // Close modal
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
    modalInstance.hide();

    // Save to localStorage
    localStorage.setItem('taskListKey', JSON.stringify(taskList));
  }
}

function editTaskModalSetup(task) {
  // ✏️ Update existing task
  console.log(task);

  modalEditTaskName.value = task.name;
  modalEditTaskDesc.value = task.description;
  modalEditDeadline.value = task.deadline;
  modalEditPriority.value = task.priority;

  currentEditedTask = task;
  return currentEditedTask; 
}

function editTask() {
  currentEditedTask.name = modalEditTaskName.value.trim();
  currentEditedTask.description = modalEditTaskDesc.value.trim();
  currentEditedTask.deadline = modalEditDeadline.value.trim();
  currentEditedTask.priority = modalEditPriority.value.trim();

  if (!currentEditedTask) {
    console.error("No task selected for editing!");
    return;
  }

  // Find the <li> associated with this task
  const taskElements = document.querySelectorAll('.list-group-item');
  taskElements.forEach((li) => {
    const id = li.dataset.taskId;
    if (taskList[id] === currentEditedTask) {
      // Update visual elements
      li.querySelector("strong").innerText = `📋 ${currentEditedTask.name}`;
      li.querySelector(".fs-6").innerText = `📅 ${currentEditedTask.deadline} |‼️ ${currentEditedTask.priority}`;
    }
  });

  localStorage.setItem('taskListKey', JSON.stringify(taskList));
  // Reset modal
  modalEditTaskName.value = "";
  modalEditTaskDesc.value = "";
  modalEditDeadline.value = "";
  modalEditPriority.value = "5";

  const editModalInstance = bootstrap.Modal.getInstance(document.getElementById("editTaskModal"));
  editModalInstance.hide();
}

function openTaskModal(task) {
  const modal = new bootstrap.Modal(document.getElementById('taskModal'));
  const now = new Date();
  const deadlineDate = new Date(task.deadline);
  
  document.getElementById('viewTaskModalLabel').textContent = task.name;
  document.getElementById('taskModalDeadlineState').textContent = 
      task.completed ? 'Completed' : (deadlineDate < now ? 'Overdue' : 'Ongoing');
  
  const modalBody = document.querySelector('#taskModal .modal-body');
  modalBody.innerHTML = `
      <p>${task.description}</p>
      <hr>
      <p>Priority: ${task.priority}/10</p>
      <p>Deadline: ${task.deadline === "TBD" ? "No deadline" : task.deadline}</p>
  `;

  modal.show();
}

document.getElementById('todoList').addEventListener('click', (event) => {
  const taskElement = event.target.closest('.list-group-item');
  if (!taskElement) return;

  const id = taskElement.dataset.taskId;
  const task = taskList[id];
  
  if (task) {
    openTaskModal(task);
  }
});

document.getElementById('completedList').addEventListener('click', (event) => {
  const taskElement = event.target.closest('.list-group-item');
  if (!taskElement) return;
  
  const id = taskElement.dataset.taskId;
  const task = taskList[id];
  
  if (task) {
    openTaskModal(task);
  }
});

// Sample data for tasks
const tasks = [
    { id: 1, status: 'finished' },
    { id: 2, status: 'ongoing' },
    { id: 3, status: 'finished' },
    { id: 4, status: 'ongoing' },
    { id: 5, status: 'overdue' }
];

// Function to update statistics
function updateStats(taskList) {
    const total = taskList.length;
    const finished = taskList.filter(task => task.status === 'finished').length;
    const ongoing = taskList.filter(task => task.status === 'ongoing').length;
    const overdue = taskList.filter(task => task.status === 'overdue').length;
    // Update the stats in the HTML
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('ongoingTasks').textContent = ongoing;
    document.getElementById('finishedTasks').textContent = finished;
    document.getElementById('overdueTasks').textContent = overdue;

    // Update progress bar
    const percent = total > 0 ? Math.round((finished / total) * 100) : 0;
    const progressBar = document.getElementById('progressBar');

    progressBar.style.width = percent + '%';
    progressBar.setAttribute('aria-valuenow', percent);
    progressBar.textContent = percent + '%';
};


updateStats(tasks);


function initializeTasks(task, id) {
  const newTask = document.createElement("li");
  newTask.className = `list-group-item list-group-item-action ${task.completed ? 'completed' : ''}`;
  newTask.innerHTML = `
  newTask.dataset.taskId = id;
    <div class="d-flex justify-content-between align-items-center w-100">
      <div>
        <strong>📋 ${task.name}</strong><br>
      </div>
      <div class="text-end">
        <span class="fs-6">📅 ${task.deadline} |‼️ ${task.priority}</span>
        <div class="dropdown d-inline ms-2">
          <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
            ⚙️
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item edit-task" data-bs-toggle="modal" data-bs-target="#editTaskModal">✏️ Edit</a></li>
            <li><a class="dropdown-item delete-task">❌ Delete</a></li>
            <li><a class="dropdown-item complete-task">✅ Complete</a></li>
          </ul>
        </div>
      </div>
    </div>
  `;

  const targetList = task.completed ? completedList : todoList;
  targetList.appendChild(newTask);
  newTask.querySelector(".dropdown-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
  });
  
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
    document.getElementById("completedList").appendChild(newTask);
    localStorage.setItem('taskListKey', JSON.stringify(taskList));
  });

  newTask.querySelector(".edit-task").addEventListener("click", (e) => {
    e.stopPropagation();
    const taskElement = e.target.closest('.list-group-item');
        if (!taskElement) return;

        const id = taskElement.dataset.taskId;
        const task = taskList[id];
        editTaskModalSetup(task)
  });
}

// Live Search Feature -Flash highlight and Scroll to first match (Kaylynn)
const searchInput = document.getElementById('skillSearch');

searchInput.addEventListener('input', function () {
  const searchValue = searchInput.value.trim().toLowerCase();
  const allTasks = document.querySelectorAll('#todoList .list-group-item, #completedList .list-group-item');

  let firstMatchFound = false;

  allTasks.forEach(task => {
    const taskText = task.querySelector('strong').textContent.toLowerCase();

    // Remove any previous animation
    task.classList.remove('flash-highlight');

    if (searchValue && taskText.includes(searchValue)) {
      // Trigger flash animation
      void task.offsetWidth; 
      task.classList.add('flash-highlight');

      // Scroll first match into center view
      if (!firstMatchFound) {
        task.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstMatchFound = true;
      }
    }
  });
});
//This will make search button work when clicked (Kaylynn)
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', function() {
  const event = new Event('input');
  searchInput.dispatchEvent(event); // Manually trigger the same search
});

// Sort Handling (Kaylynn)
const alphabeticalSort = document.getElementById('alphabeticalSort');
const prioritySort = document.getElementById('prioritySort');
const deadlineSort = document.getElementById('deadlineSort');

// Listen for sorting option change
alphabeticalSort.addEventListener('change', handleSort);
prioritySort.addEventListener('change', handleSort);
deadlineSort.addEventListener('change', handleSort);

function handleSort() {
  if (alphabeticalSort.checked) {
    taskList.sort((a, b) => a.name.localeCompare(b.name));
  } else if (prioritySort.checked) {
    taskList.sort((a, b) => b.priority - a.priority);
  } else if (deadlineSort.checked) {
    taskList.sort((a, b) => {
      const dateA = a.deadline === "TBD" ? new Date(3000, 0, 1) : new Date(a.deadline);
      const dateB = b.deadline === "TBD" ? new Date(3000, 0, 1) : new Date(b.deadline);
      return dateA - dateB;
    });
  }

  renderTasks();
  localStorage.setItem('taskListKey', JSON.stringify(taskList));
}

// This will separate renderTasks() function outside
function renderTasks() {
  todoList.innerHTML = '';
  completedList.innerHTML = '';

  taskList.forEach((task, index) => {
    if (task) {
      task.id = index; // Update ID correctly after sorting
      initializeTasks(task, index);
    }
  });


  // After rerendering, update localStorage
  localStorage.setItem('taskListKey', JSON.stringify(taskList));
}
