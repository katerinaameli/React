// class Task {

//     constructor(task_id, name, done, due_date, list_id, description) {
//         if (typeof name === 'object') {
//             Object.assign(this, name);
//         } else {
//             this.task_id = task_id;
//             this.name = name;
//             this.done = done;
//             this.due_date = due_date;
//             this.list_id = list_id;
//             this.description = description 
//         }
//     }
// }
function Task(props) {
    const { task_id, name, done, due_date, list_id, description } = props.task;
    let taskNode = document.createElement("div")

    taskNode.className = "task_elem"
    taskContainer.appendChild(taskNode)
    taskNode.classList.toggle('done', done)

    var changeDone = document.createElement('input')
    changeDone.setAttribute('type', 'checkbox')


    if (done) {
        changeDone.setAttribute('checked', ' ')
    }
    taskNode.appendChild(changeDone)


    taskNode.innerHTML += `<span class="task_name">${name}</span>`
    taskNode.innerHTML += `<p class="some"> ${overdueDate(ParseDate(due_date), done)} </p>`
    taskNode.innerHTML += `<button onClick="Delete(this, ${task_id})">Remove</button>`
    if (description) {
        taskNode.innerHTML += `<p class="description">${description}</p>`
    }


    changeDone = taskNode.querySelector('input');
    changeDone.addEventListener('click', function () {
        taskNode.classList.toggle('done')
        CheckBoxChange(task)
    })
    return taskNode
}

const taskContainer = document.getElementById('tasks')

function appendTasks(task) {
    let taskElement = Task({ task })
    taskContainer.appendChild(taskElement)
}

function ParseDate(due_date) {
    var date = new Date(due_date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const new_date = [year, month, day].join('/');
    return new_date
}

function Delete(button, id) {
    button.closest('.task_elem').remove()
    fetch(`http://localhost:8080/tasks/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())

    // .catch(alert('Can`t delete'))
}

let ShowTask = document.getElementById('checkbox')
ShowTask.onchange = function () {
    taskContainer.classList.toggle('show-done', ShowTask.checked)
}

// tasks.forEach(appendTasks)



function overdueDate(date, done) {

    if (new Date(date) < new Date() && done === false) {
        return `<span style="color:red">${date}</span>`
    } else {
        return `<span>${date}</span>`
    }

}

const taskForm = document.forms['new_task']

const tasksEndpoint = 'http://localhost:8080/tasks'

taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const task = Object.fromEntries(formData.entries());
    task.done = false
    console.log(task);
    task.list_id = 1
    // tasks.push(task)

    taskForm.reset();
    CreateTask(task)
        .then(appendTasks)
})

function CreateTask(task) {
    return fetch(tasksEndpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => response.json())

}


function CheckBoxChange(task) {
    task.done = !task.done
    return fetch(`http://localhost:8080/tasks/${task.task_id}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    })
        .then(response => response.json())
}



fetch(tasksEndpoint)
    .then(response => response.json())
    .then(tasks => tasks.forEach(appendTasks))




