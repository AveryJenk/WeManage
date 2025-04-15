console.log("App is working!");

document.addEventListener("DOMContentLoaded", function () {
  const todoList = document.getElementById("todoList");
  const modalAddButton = document.querySelector("#addTaskModal .skillAdd");
  const modalTaskName = document.getElementById("taskInputName");
  const modalTaskDesc = document.getElementById("taskInputDescription");
  const modalDeadline = document.getElementById("deadlineInput");
  const modalPriority = document.getElementById("priorityRange");

  let taskBeingEdited = null; // Track which task is being edited

  modalAddButton.addEventListener("click", function () {
    const name = modalTaskName.value.trim();
    const description = modalTaskDesc.value.trim();
    const deadline = modalDeadline.value || "TBD";
    const priority = modalPriority.value;

    if (name !== "") {
      if (taskBeingEdited) {
        // ✏️ Update existing task
        taskBeingEdited.querySelector("strong").innerText = `📋 ${name}`;
        taskBeingEdited.querySelector("small").innerText = description;
        taskBeingEdited.querySelector(".fs-6").innerText = `📅 ${deadline} |‼️  ${priority}`;
        taskBeingEdited = null; // Reset
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

        /** This is for the dropdown options for tasks */
        newTask.querySelector(".delete-task").addEventListener("click", (e) => {
          e.stopPropagation();
          newTask.remove();
        });

        newTask.querySelector(".complete-task").addEventListener("click", (e) => {
          e.stopPropagation();
          newTask.classList.add("completed");
          document.getElementById("completedList").appendChild(newTask);
        });

        newTask.querySelector(".edit-task").addEventListener("click", (e) => {
          e.stopPropagation();
          taskBeingEdited = newTask;

          /**Read data */
          const taskTitle = newTask.querySelector("strong").innerText.replace("📋 ", "");
          const taskDesc = newTask.querySelector("small").innerText;
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
      }

      // Reset modal
      modalTaskName.value = "";
      modalTaskDesc.value = "";
      modalDeadline.value = "";
      modalPriority.value = "5";

      const modalInstance = bootstrap.Modal.getInstance(document.getElementById("addTaskModal"));
      modalInstance.hide();
    }
  });
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
    const ongoing = taskList.filter(task => task.status === 'overdue').length;
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
}

updateStats(tasks);
