console.log("App is working!");

document.addEventListener("DOMContentLoaded", function () {
  modalAddButton.addEventListener("click", addTask);

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

    if (name !== "") {
      if (taskBeingEdited) {
        // ✏️ Update existing task
        taskBeingEdited.querySelector("strong").innerText = `📋 ${name}`;
        taskBeingEdited.querySelector("small").innerText = description;
        taskBeingEdited.querySelector(".fs-6").innerText = `📅 ${deadline} |‼️ ${priority}`;
        taskBeingEdited = null; // Reset the edit tracker
      } else {
        // ➕ Add new task
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
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                  ⚙️
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item edit-task" href="#">✏️ Edit</a></li>
                  <li><a class="dropdown-item delete-task" href="#">❌ Delete</a></li>
                  <li><a class="dropdown-item complete-task" href="#">✅ Complete</a></li>
                </ul>
              </div>
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

const todoList = document.getElementById("todoList");
const completedList = document.getElementById("completedList");
const modalAddButton = document.querySelector("#addTaskModal .skillAdd");
const modalTaskName = document.getElementById("taskInputName");
const modalTaskDesc = document.getElementById("taskInputDescription");
const modalDeadline = document.getElementById("deadlineInput");
const modalPriority = document.getElementById("priorityRange");
let taskBeingEdited = null; // Track which task is being edited



function addTask() {
  const name = modalTaskName.value.trim();
  const description = modalTaskDesc.value.trim();
  const deadline = modalDeadline.value || "TBD";
  const priority = modalPriority.value;

  if (name) {
    if (taskBeingEdited) {
      editTask(name, description, deadline, priority);
    } else {
      // ➕ Add new task
      const newTask = document.createElement("li");
      newTask.className = "list-group-item list-group-item-action";
      newTask.innerHTML = `
        <div class="d-flex justify-content-between align-items-center w-100">
          <div>
            <strong>📋 ${name}</strong><br>
          </div>
          <div class="text-end">
            <span class="fs-6">📅 ${deadline} |‼️  ${priority}</span>
            <div class="dropdown d-inline ms-2">
              <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                ⚙️
              </button>
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

      /** This is for the dropdown options for tasks */
      newTask.querySelector(".dropdown-toggle").addEventListener("click", (e) => {
        e.stopPropagation();
      });
      
      newTask.querySelector(".delete-task").addEventListener("click", (e) => {
        e.stopPropagation();
        const id = newTask.dataset.taskId;
        taskList[id] = null;
        newTask.remove();
      });

      newTask.querySelector(".complete-task").addEventListener("click", (e) => {
        e.stopPropagation();
        const id = newTask.dataset.taskId;
        if (taskList[id]) taskList[id].completed = true;
        newTask.classList.add("completed");
        document.getElementById("completedList").appendChild(newTask);
      });

          /**Collects the data */
          const taskTitle = newTask.querySelector("strong").innerText.replace("📋 ", "");
          const taskDesc = newTask.querySelector("small").innerText;
          const taskMeta = newTask.querySelector(".fs-6").innerText;
          const deadlineMatch = taskMeta.match(/📅 (.*?) \|/);
          const priorityMatch = taskMeta.match(/‼️\s*(.*)/);

          // Pre-fill modal
          modalTaskName.value = taskTitle;
          modalTaskDesc.value = taskDesc;
          modalDeadline.value = deadlineMatch ? deadlineMatch[1] : "";
          modalPriority.value = priorityMatch ? priorityMatch[1] : "5";
      newTask.querySelector(".edit-task").addEventListener("click", (e) => {
        e.stopPropagation();
        taskBeingEdited = newTask;

        /**Read data */
        const taskTitle = newTask.querySelector("strong").innerText.replace("📋 ", "");
        const taskMeta = newTask.querySelector(".fs-6").innerText;
        const deadlineMatch = taskMeta.match(/📅 (.*?) \|/);
        const priorityMatch = taskMeta.match(/‼️  (.*)/);

        /**Add prefill if no choice */
        modalTaskName.value = taskTitle;
        modalTaskDesc.value = taskDesc;
        modalDeadline.value = deadlineMatch ? deadlineMatch[1] : "";
        modalPriority.value = priorityMatch ? priorityMatch[1] : "5";

      /**Resets the modal */
      modalTaskName.value = "";
      modalTaskDesc.value = "";
      modalDeadline.value = "";
      modalPriority.value = "5";

      const modalElement = document.getElementById("addTaskModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
        const modal = new bootstrap.Modal(document.getElementById("addTaskModal"));
        modal.show();
      });
    }

    // Reset modal
    modalTaskName.value = "";
    modalTaskDesc.value = "";
    modalDeadline.value = "";
    modalPriority.value = "5";

    const modalInstance = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
    modalInstance.hide();

    //Will cache the list after every task modification
    localStorage.setItem('taskListKey', JSON.stringify(taskList));
  }
}

function editTask(name, description, deadline, priority) {
  // ✏️ Update existing task
  taskBeingEdited.querySelector("strong").innerText = `📋 ${name}`;
  taskBeingEdited.querySelector("small").innerText = description;
  taskBeingEdited.querySelector(".fs-6").innerText = `📅 ${deadline} |‼️  ${priority}`;

  const id = taskBeingEdited.dataset.taskId;
  if (taskList[id]) {
    taskList[id].name = name;
    taskList[id].description = description;
    taskList[id].deadline = deadline;
    taskList[id].priority = priority;
  }
  taskBeingEdited = null; // Reset
  localStorage.setItem('taskListKey', JSON.stringify(taskList));
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
    document.getElementById('overduetasks').textContent = overdue;

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

  newTask.querySelector(".dropdown-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
  });
  
  newTask.querySelector(".delete-task").addEventListener("click", (e) => {
    e.stopPropagation();
    const id = newTask.dataset.taskId;
    taskList[id] = null;
    newTask.remove();
  });

  newTask.querySelector(".complete-task").addEventListener("click", (e) => {
    e.stopPropagation();
    const id = newTask.dataset.taskId;
    if (taskList[id]) taskList[id].completed = true;
    newTask.classList.add("completed");
    document.getElementById("completedList").appendChild(newTask);
  });

  newTask.querySelector(".edit-task").addEventListener("click", (e) => {
    e.stopPropagation();
    taskBeingEdited = newTask;

    /**Read data */
    const taskTitle = newTask.querySelector("strong").innerText.replace("📋 ", "");
    const taskMeta = newTask.querySelector(".fs-6").innerText;
    const deadlineMatch = taskMeta.match(/📅 (.*?) \|/);
    const priorityMatch = taskMeta.match(/‼️  (.*)/);

    /**Add prefill if no choice */
    modalTaskName.value = taskTitle;
    modalTaskDesc.value = taskDesc;
    modalDeadline.value = deadlineMatch ? deadlineMatch[1] : "";
    modalPriority.value = priorityMatch ? priorityMatch[1] : "5";

    const modal = new bootstrap.Modal(document.getElementById("addTaskModal"));
    modal.show();
  });
  
  newTask.dataset.taskId = id;
}