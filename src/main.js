// Massiiv kõigi taskide jaoks
let tasks = [];

// DOM elemendid
let taskList;
let addTask;
let taskInput;

// Sinu access token
const ACCESS_TOKEN = "E5Q7-iN8HLCY-v8IUiEjkv7GK7EJkm1A";

// Laeme serverist olemasolevad taskid
async function loadTasksFromServer() {
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

        // Kuvame kõik taskid lehele
        tasks.forEach(task => renderTask(task));
    } catch (err) {
        console.error('Taskide laadimisel viga:', err);
    }
}

// Kui leht on laetud
window.addEventListener('load', () => {
    taskList = document.querySelector('#task-list');
    addTask = document.querySelector('#add-task');
    taskInput = document.querySelector('#new-task-name');

    // Laeme olemasolevad taskid
    loadTasksFromServer();

    // Nupu vajutamisel lisame uue taski
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
            taskInput.value = ''; // tühjendame inputi
        } catch (err) {
            console.error('Taski lisamisel viga:', err);
        }
    });
});

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
