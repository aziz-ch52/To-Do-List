let tasks = [];
let currentFilter = 'all';
let taskIdCounter = 1;

// Add task function
function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();

  if (taskText === '') {
    input.focus();
    input.style.borderColor = '#ef4444';
    setTimeout(() => {
      input.style.borderColor = '#e1e8ed';
    }, 2000);
    return;
  }

  const newTask = {
    id: taskIdCounter++,
    text: taskText,
    completed: false,
    createdAt: new Date(),
  };

  tasks.unshift(newTask);
  input.value = '';
  updateDisplay();

  // Add a subtle success feedback
  input.style.borderColor = '#10b981';
  setTimeout(() => {
    input.style.borderColor = '#e1e8ed';
  }, 1500);
}

// Toggle task completion
function toggleTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    updateDisplay();
  }
}

// Delete task function
function deleteTask(taskId) {
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex > -1) {
    // Add fade out animation before removing
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
      taskElement.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => {
        tasks.splice(taskIndex, 1);
        updateDisplay();
      }, 300);
    } else {
      tasks.splice(taskIndex, 1);
      updateDisplay();
    }
  }
}

// Filter tasks
function filterTasks(filter) {
  currentFilter = filter;

  // Update filter button styles
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  updateDisplay();
}

// Update the display
function updateDisplay() {
  const taskList = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');

  // Filter tasks based on current filter
  let filteredTasks = tasks;
  if (currentFilter === 'pending') {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  // Clear current tasks
  taskList.innerHTML = '';

  // Show/hide empty state
  if (filteredTasks.length === 0) {
    emptyState.style.display = 'block';

    // Update empty state message based on filter
    const emptyStateH3 = emptyState.querySelector('h3');
    const emptyStateP = emptyState.querySelector('p');

    if (currentFilter === 'pending' && tasks.length > 0) {
      emptyStateH3.textContent = 'No pending tasks';
      emptyStateP.textContent = 'Great job! All tasks are completed.';
    } else if (currentFilter === 'completed' && tasks.length > 0) {
      emptyStateH3.textContent = 'No completed tasks';
      emptyStateP.textContent = 'Complete some tasks to see them here.';
    } else {
      emptyStateH3.textContent = 'No tasks yet';
      emptyStateP.textContent = 'Add a task above to get started on your productive day!';
    }
  } else {
    emptyState.style.display = 'none';

    // Add filtered tasks to the list
    filteredTasks.forEach((task) => {
      const taskItem = createTaskElement(task);
      taskList.appendChild(taskItem);
    });
  }

  // Update statistics
  updateStats();
}

// Create task element
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = `task-item ${task.completed ? 'completed' : ''}`;
  li.setAttribute('data-task-id', task.id);

  li.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'checked' : ''}" onclick="toggleTask(${
    task.id
  })">
                    ${task.completed ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <span class="task-text">${escapeHtml(task.text)}</span>
                <div class="task-actions">
                    <button class="action-btn complete-btn" onclick="toggleTask(${
                      task.id
                    })" title="${task.completed ? 'Mark as pending' : 'Mark as complete'}">
                        <i class="fas ${task.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteTask(${
                      task.id
                    })" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

  return li;
}

// Update statistics
function updateStats() {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  document.getElementById('totalTasks').textContent = totalTasks;
  document.getElementById('completedTasks').textContent = completedTasks;
  document.getElementById('pendingTasks').textContent = pendingTasks;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Add fade out animation to CSS
const style = document.createElement('style');
style.textContent = `
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateX(100px);
                }
            }
        `;
document.head.appendChild(style);

// Handle Enter key press in input field
document.getElementById('taskInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initialize display
updateDisplay();
