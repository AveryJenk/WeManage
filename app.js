console.log("App is working!");

document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todoList");

  /**This adds the created task to the to-do modal (Kaylynn) */
  const modalAddButton = document.querySelector("#addTaskModal .skillAdd");
  const modalTaskName = document.getElementById("taskInputName");
  const modalTaskDesc = document.getElementById("taskInputDescription");
  const modalDeadline = document.querySelector("#addTaskModal input[type='date']");
  const modalPriority = document.getElementById("priorityRange");

  modalAddButton.addEventListener("click", function () {
    const name = modalTaskName.value.trim();
    const description = modalTaskDesc.value.trim();
    const deadline = modalDeadline.value || "TBD";
    const priority = modalPriority.value;

    if (name !== "") {
      const newTask = document.createElement("li");
      newTask.className = "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
      newTask.setAttribute("data-bs-toggle", "modal");
      newTask.setAttribute("data-bs-target", "#taskModal");

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
                <li><a class="dropdown-item edit-task"  data-bs-toggle="modal" data-bs-target="#editTaskModal" href="#">✏️ Edit</a></li>
                <li><a class="dropdown-item delete-task" href="#">❌ Delete</a></li>
                <li><a class="dropdown-item complete-task" href="#">✅ Complete</a></li>
              </ul>
            </div>
          </div>
        </div>
        <span class="fs-6">Deadline: ${deadline} | Priority: ${priority}</span>
      `;

      todoList.appendChild(newTask);

      /**This clears the input in modal (Kaylynn) */
      modalTaskName.value = "";
      modalTaskDesc.value = "";
      modalDeadline.value = "";
      modalPriority.value = "5";

      /**This closes the modal (Kaylynn) */
      const modalElement = document.getElementById("addTaskModal");
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance.hide();
    }
  });
});

/**This is the search function (Kaylynn)*/
const searchInput = document.getElementById("skillSearch");

searchInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const filter = searchInput.value.toLowerCase();
    const allTasks = document.querySelectorAll("#todoList li, #completedList li");
    let found = false;

    allTasks.forEach(task => {
      const text = task.textContent.toLowerCase();

      if (!found && text.includes(filter)) {
        task.scrollIntoView({ behavior: "smooth", block: "center" });
        task.classList.add("bg-primary", "text-white", "fw-bold");
        setTimeout(() => {
          task.classList.remove("bg-primary", "text-white", "fw-bold");
        }, 6000);

        found = true;
      }
    });

    if (!found) {
      alert("No matching task found.");
    }
  }
});

// Sample data for tasks
const tasks = [
    { id: 1, status: 'finished' },
    { id: 2, status: 'ongoing' },
    { id: 3, status: 'finished' },
    { id: 4, status: 'ongoing' },
    { id: 5, status: 'finished' }
];

// Function to update statistics
function updateStats(taskList) {
    const total = taskList.length;
    const finished = taskList.filter(task => task.status === 'finished').length;
    const ongoing = taskList.filter(task => task.status === 'ongoing').length;

    // Update the stats in the HTML
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('ongoingTasks').textContent = ongoing;
    document.getElementById('finishedTasks').textContent = finished;

    // Update progress bar
    const percent = total > 0 ? Math.round((finished / total) * 100) : 0;
    const progressBar = document.getElementById('progressBar');

    progressBar.style.width = percent + '%';
    progressBar.setAttribute('aria-valuenow', percent);
    progressBar.textContent = percent + '%';
}

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
