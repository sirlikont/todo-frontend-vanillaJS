// Massiiv kõigi taskide jaoks
let tasks = [];

// DOM elemendid
let taskList;
let addTask;
let taskInput;

// Access token
let ACCESS_TOKEN = null;

// Laeme serverist olemasolevad taskid
async function loadTasksFromServer() {
    if (!ACCESS_TOKEN) return;

    try {
        const response = await fetch('/tasks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
        });

        if (!response.ok) throw new Error('Serveri viga: ' + response.status);

        const data = await response.json();
        tasks = data;

        // Tühjenda vana list ja kuva uuesti
        taskList.innerHTML = '';
        tasks.forEach(task => renderTask(task));
    } catch (err) {
        console.error('Taskide laadimisel viga:', err);
    }
}

// Funktsioon ühe taski kuvamiseks
function renderTask(task) {
    const taskRow = createTaskRow(task);
    taskList.appendChild(taskRow);
}

// Loome taski rida DOM-i
function createTaskRow(task) {
    const taskRow = document.querySelector('[data-template="task-row"]').cloneNode(true);
    taskRow.removeAttribute('data-template');

    const name = taskRow.querySelector("[name='name']");
    name.value = task.title;

// Kui kasutaja muudab ülesande teksti
name.addEventListener('change', async () => {
    const newTitle = name.value.trim();
    if (!newTitle || newTitle === task.title) return; // Kui ei muudetud midagi, ära tee päringut

    try {
        const response = await fetch(`/tasks/${task.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: newTitle })
        });

        if (!response.ok) throw new Error('Serveri viga: ' + response.status);

        // Uuendame kohalikus massiivis
        task.title = newTitle;
        console.log(`Task "${task.id}" uuendatud`);
    } catch (err) {
        console.error('Taski muutmisel viga:', err);
    }
});

const checkbox = taskRow.querySelector("[name='completed']");
checkbox.checked = task.marked_as_done;

// et checkbox ka serverisse salvestuks
checkbox.addEventListener('change', async () => {
    try {
        const response = await fetch(`/tasks/${task.id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ marked_as_done: checkbox.checked })
        });

        if (!response.ok) throw new Error('Serveri viga: ' + response.status);

        console.log(`Task ${task.id} uuendatud: ${checkbox.checked}`);
    } catch (err) {
        console.error('Taski uuendamisel viga:', err);
    }
});

const deleteButton = taskRow.querySelector('.delete-task');
deleteButton.addEventListener('click', async () => {
    try {
        const response = await fetch(`/tasks/${task.id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
        });

        if (!response.ok) throw new Error('Serveri viga: ' + response.status);

        taskList.removeChild(taskRow);
        tasks.splice(tasks.indexOf(task), 1);
    } catch (err) {
        console.error('Taski kustutamisel viga:', err);
    }
});

// Eridisainiga checkbox
hydrateAntCheckboxes(taskRow);

return taskRow;
}

// Checkboxide eridisaini funktsioon
function hydrateAntCheckboxes(element) {
    const elements = element.querySelectorAll('.ant-checkbox-wrapper');
    elements.forEach(wrapper => {
        if (wrapper.__hydrated) return;
        wrapper.__hydrated = true;

        const checkbox = wrapper.querySelector('.ant-checkbox');
        const input = wrapper.querySelector('.ant-checkbox-input');

        if (input.checked) checkbox.classList.add('ant-checkbox-checked');

        input.addEventListener('change', () => {
            checkbox.classList.toggle('ant-checkbox-checked');
        });
    });
}

// Kui leht on laetud
window.addEventListener('load', () => {
    // DOM elemendid
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');
    taskInput = document.querySelector('#new-task-name');

    const loginButton = document.querySelector('#login-button');
    const logoutButton = document.querySelector('#logout-button');

    // LOGIN
    loginButton.addEventListener('click', async () => {
        const username = document.querySelector('#login-username').value;
        const password = document.querySelector('#login-password').value;

        try {
            const response = await fetch('/users/get-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) throw new Error('Vale kasutajanimi või parool');

            const data = await response.json();
            ACCESS_TOKEN = data.access_token;
            sessionStorage.setItem('token', ACCESS_TOKEN);

            document.querySelector('#login-container').style.display = 'none';
            document.querySelector('#todo-container').style.display = 'block';

            loadTasksFromServer();
        } catch (err) {
            console.error(err);
        }
    });

    // LOGOUT
    logoutButton.addEventListener('click', () => {
        sessionStorage.removeItem('token');
        ACCESS_TOKEN = null;
        document.querySelector('#login-container').style.display = 'block';
        document.querySelector('#todo-container').style.display = 'none';
    });

    // Kui token juba olemas
    const token = sessionStorage.getItem('token');
    if (token) {
        ACCESS_TOKEN = token;
        document.querySelector('#login-container').style.display = 'none';
        document.querySelector('#todo-container').style.display = 'block';
        loadTasksFromServer();
    }

    // Lisame uue taski
    addTask.addEventListener('click', async () => {
        const title = taskInput.value.trim();
        if (!title) return;

        try {
            const response = await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, desc: "" })
            });

            if (!response.ok) throw new Error('Serveri viga: ' + response.status);

            const newTask = await response.json();
            tasks.push(newTask);
            renderTask(newTask);
            taskInput.value = '';
        } catch (err) {
            console.error('Taski lisamisel viga:', err);
        }
    });
});