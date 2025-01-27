// taskManager.js

class TaskManager {
    constructor() {
      this.tasks = this.loadTasks(); // Load tasks from localStorage
      this.renderTasks(); // Render tasks on page load
    }
  
    // Load tasks from localStorage
    loadTasks() {
      const tasks = localStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    }
  
    // Save tasks to localStorage
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  
    // Add a new task
    addTask(title, description, priority, dueDate) {
      const task = {
        id: Date.now(), // Unique ID
        title,
        description,
        priority,
        dueDate,
        completed: false,
      };
      this.tasks.push(task);
      this.saveTasks();
      this.renderTasks();
    }
  
    // Delete a task by ID
    deleteTask(taskId) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
      this.saveTasks();
      this.renderTasks();
    }
  
    // Update a task by ID
    updateTask(taskId, updates) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) {
        Object.assign(task, updates);
        this.saveTasks();
        this.renderTasks();
      }
    }
  
    // Toggle task completion status
    toggleTaskCompletion(taskId) {
      const task = this.tasks.find((task) => task.id === taskId);
      if (task) {
        task.completed = !task.completed;
        this.saveTasks();
        this.renderTasks();
      }
    }
  
    // Filter tasks by completion status
    filterTasks(completed) {
      return this.tasks.filter((task) => task.completed === completed);
    }
  
    // Sort tasks by priority or due date
    sortTasks(sortBy) {
      if (sortBy === 'priority') {
        const priorityOrder = { low: 1, medium: 2, high: 3 };
        return this.tasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
      } else if (sortBy === 'dueDate') {
        return this.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      }
      return this.tasks;
    }
  
    // Search tasks by title or description
    searchTasks(query) {
      return this.tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase())
      );
    }
  
    // Render tasks to the DOM
    renderTasks() {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = ''; // Clear existing tasks
  
      this.tasks.forEach((task) => {
        const taskItem = document.createElement('div');
        taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
        taskItem.innerHTML = `
          <div>
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <small>Priority: ${task.priority}</small>
            <small>Due Date: ${task.dueDate}</small>
          </div>
          <div class="task-actions">
            <button class="complete-btn" onclick="taskManager.toggleTaskCompletion(${task.id})">
              ${task.completed ? 'Undo' : 'Complete'}
            </button>
            <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">Delete</button>
            <button class="edit-btn" onclick="openEditModal(${task.id})">Edit</button>
          </div>
        `;
        taskList.appendChild(taskItem);
      });
    }
  }
  
  // Initialize TaskManager
  const taskManager = new TaskManager();
  
  // Event Listener for Task Form Submission
  document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
  
    if (title && dueDate) {
      taskManager.addTask(title, description, priority, dueDate);
      e.target.reset(); // Clear form
    } else {
      alert('Task title and due date are required!');
    }
  });
  
  // Open Edit Modal
  function openEditModal(taskId) {
    const task = taskManager.tasks.find((task) => task.id === taskId);
    if (task) {
      document.getElementById('editTaskTitle').value = task.title;
      document.getElementById('editTaskDescription').value = task.description;
      document.getElementById('editTaskPriority').value = task.priority;
      document.getElementById('editTaskDueDate').value = task.dueDate;
      document.getElementById('editTaskId').value = taskId;
      document.getElementById('editModal').style.display = 'block';
    }
  }
  
  // Close Edit Modal
  function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
  }
  
  // Event Listener for Edit Form Submission
  document.getElementById('editTaskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const taskId = parseInt(document.getElementById('editTaskId').value);
    const title = document.getElementById('editTaskTitle').value;
    const description = document.getElementById('editTaskDescription').value;
    const priority = document.getElementById('editTaskPriority').value;
    const dueDate = document.getElementById('editTaskDueDate').value;
  
    if (title && dueDate) {
      taskManager.updateTask(taskId, { title, description, priority, dueDate });
      closeEditModal();
    } else {
      alert('Task title and due date are required!');
    }
  });
  
  // Event Listener for Filter Buttons
  document.getElementById('filterAll').addEventListener('click', () => {
    taskManager.renderTasks();
  });
  
  document.getElementById('filterCompleted').addEventListener('click', () => {
    const completedTasks = taskManager.filterTasks(true);
    renderFilteredTasks(completedTasks);
  });
  
  document.getElementById('filterIncomplete').addEventListener('click', () => {
    const incompleteTasks = taskManager.filterTasks(false);
    renderFilteredTasks(incompleteTasks);
  });
  
  // Event Listener for Sort Buttons
  document.getElementById('sortPriority').addEventListener('click', () => {
    const sortedTasks = taskManager.sortTasks('priority');
    renderFilteredTasks(sortedTasks);
  });
  
  document.getElementById('sortDueDate').addEventListener('click', () => {
    const sortedTasks = taskManager.sortTasks('dueDate');
    renderFilteredTasks(sortedTasks);
  });
  
  // Event Listener for Search Input
  document.getElementById('searchInput').addEventListener('input', (e) => {
    const query = e.target.value;
    const searchedTasks = taskManager.searchTasks(query);
    renderFilteredTasks(searchedTasks);
  });
  
  // Render filtered tasks
  function renderFilteredTasks(tasks) {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Clear existing tasks
  
    tasks.forEach((task) => {
      const taskItem = document.createElement('div');
      taskItem.className = `task-item ${task.completed ? 'task-completed' : ''}`;
      taskItem.innerHTML = `
        <div>
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <small>Priority: ${task.priority}</small>
          <small>Due Date: ${task.dueDate}</small>
        </div>
        <div class="task-actions">
          <button class="complete-btn" onclick="taskManager.toggleTaskCompletion(${task.id})">
            ${task.completed ? 'Undo' : 'Complete'}
          </button>
          <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">Delete</button>
          <button class="edit-btn" onclick="openEditModal(${task.id})">Edit</button>
        </div>
      `;
      taskList.appendChild(taskItem);
    });
  }