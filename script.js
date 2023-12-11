
const CRUD_API_LINK = "https://crudcrud.com/api/5e9f034bf1dc45f29483742ffe6565a5";

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const descriptionInput = document.getElementById('descriptionInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value !== '') {
        const task = {
            task: taskInput.value,
            description: descriptionInput.value,
            completed: false
        };

        try {
            // Save task to CRUD system
            const response = await fetch(CRUD_API_LINK, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            });

            const data = await response.json();

            // Add task to the displayed list
            if (data.id) {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${task.task}</strong>: ${task.description} 
                    <button onclick="completeTask(${data.id})">Tick</button>
                    <button onclick="deleteTask(${data.id})">Wrong Tick</button>`;
                taskList.appendChild(li);
            }

            // Clear input fields
            taskInput.value = '';
            descriptionInput.value = '';
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
}

async function completeTask(taskId) {
    try {
        // Update task status to completed in CRUD system
        await fetch(`${CRUD_API_LINK}/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: true }),
        });

        // Move task to completed tasks list
        const taskList = document.getElementById('taskList');
        const completedTaskList = document.getElementById('completedTaskList');
        const taskItem = taskList.querySelector(`li[data-task-id="${taskId}"]`);
        
        if (taskItem) {
            completedTaskList.appendChild(taskItem);
        }
    } catch (error) {
        console.error('Error completing task:', error);
    }
}

async function deleteTask(taskId) {
    try {
        // Delete task from CRUD system
        await fetch(`${CRUD_API_LINK}/${taskId}`, {
            method: 'DELETE',
        });

        // Remove task from the displayed list
        const taskList = document.getElementById('taskList');
        const completedTaskList = document.getElementById('completedTaskList');
        const taskItem = document.querySelector(`li[data-task-id="${taskId}"]`);
        
        if (taskItem) {
            taskItem.remove();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

async function loadTasks() {
    try {
        // Load tasks from CRUD system
        const response = await fetch(CRUD_API_LINK);
        const tasks = await response.json();

        // Display tasks in the list
        const taskList = document.getElementById('taskList');
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.setAttribute('data-task-id', task.id);
            li.innerHTML = `<strong>${task.task}</strong>: ${task.description} 
                <button onclick="completeTask(${task.id})">Tick</button>
                <button onclick="deleteTask(${task.id})">Wrong Tick</button>`;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}

// Load tasks when the page is loaded
window.onload = loadTasks;
