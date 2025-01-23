const API_URL = 'http://localhost:4000/api/advanced';
const JSON_SERVER_URL = 'http://localhost:3030';

async function loadStats() {
    const response = await fetch(`${API_URL}/tasks/stats`);
    const stats = await response.json();
    
    document.getElementById('stats').innerHTML = `
        <h3>Statistiques</h3>
        <p>Total: ${stats.total} |
           Terminées: ${stats.completed} |
           En cours: ${stats.pending} |
           En retard: ${stats.overdue}</p>
    `; // I hate putting HTML in my JS, but anw
}

async function loadTasks() {
    const response = await fetch(`${JSON_SERVER_URL}/tasks`);
    const tasks = await response.json();
    displayTasks(tasks);
}

function displayTasks(tasks) {
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = '';
    
    tasks.forEach(task => { // Loops over all the tasks, and display them accordingly
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.completed ? 'completed' : ''}`;
        
        const completeBtn = document.createElement('button');
        task.completed ? completeBtn.textContent = 'Réinitialiser' : completeBtn.textContent = 'Terminer'; // Changes with state
        completeBtn.addEventListener('click', () => completeTask(task.id));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskElement.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <small>Échéance: ${new Date(task.dueDate).toLocaleDateString()}</small>
            </div>
        `;
        
        taskElement.appendChild(completeBtn);
        taskElement.appendChild(deleteBtn);
        tasksList.appendChild(taskElement);
    });
}

// Lot of small utility functions, to handle fetching and displaying tasks
async function searchTasks() {
    const query = document.getElementById('searchInput').value;
    const response = await fetch(`${API_URL}/tasks/search?query=${query}`);
    const tasks = await response.json();
    displayTasks(tasks);
}

async function showDueSoonTasks() {
    const response = await fetch(`${API_URL}/tasks/dueSoon`);
    const tasks = await response.json();
    displayTasks(tasks);
}

async function completeAllTasks() {
    await fetch(`${API_URL}/tasks/completeAll`, { method: 'POST' });
    loadTasks();
    loadStats();
}

async function resetAllTasks() {
    await fetch(`${API_URL}/tasks/resetAll`, { method: 'POST' });
    loadTasks();
    loadStats();
}

async function deleteTask(id) {
    await fetch(`${JSON_SERVER_URL}/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
    loadStats();
}

async function completeTask(id) {
    await fetch(`${API_URL}/tasks/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    loadTasks();
    loadStats();
}

// Handle form submission, adds a new task
document.getElementById('addTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const task = {
        title: document.getElementById('titleInput').value,
        description: document.getElementById('descriptionInput').value,
        dueDate: document.getElementById('dueDateInput').value,
        completed: false
    };
    
    await fetch(`${JSON_SERVER_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    
    loadTasks();
    loadStats();
    e.target.reset();
});

// Event listeners
document.getElementById('searchInput').addEventListener('input', searchTasks); // To make the search dynamic, disable if you want to search on submit
document.getElementById('searchBtn').addEventListener('click', searchTasks);
document.getElementById('dueSoonBtn').addEventListener('click', showDueSoonTasks);
document.getElementById('completeAllBtn').addEventListener('click', completeAllTasks);
document.getElementById('resetAllBtn').addEventListener('click', resetAllTasks);

// Initial load
loadTasks();
loadStats();