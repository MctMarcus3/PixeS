function getTasks() { 
    $.ajax({
        url: "/task/api/tasks",
        dataType: "json",
        success: function(data){
            return renderTasks(data);
        },
        error: function() { 
            console.log("Error Occurred")
            return null;
        }
    });
}
function renderTasks(tasks) {
    const listBody = document.getElementById('list-body');
    listBody.innerHTML = '';
    for (const index in tasks) {
        let card = getCard(index, tasks);
        listBody.appendChild(card);
    }
}

function getCard(index, tasks) {
    let card = document.createElement("div");
    card.classList.add('card');
    
    let cardText = getCardText(index, tasks);
    let cardPriority = getCardPriority(index, tasks);
    let cardActions = getCardActions(index, tasks);
    
    card.appendChild(cardText);
    card.appendChild(cardPriority);
    card.appendChild(cardActions);
    return card;
}

function getCardText(index, tasks) {
    console.log(tasks)
    let cardText = document.createElement("div");
    cardText.classList.add('card_text');
    let textnode = document.createTextNode(tasks[index].name);
    cardText.appendChild(textnode);
    return cardText;
}

function getCardPriority(index, tasks) {
    let cardPriority = document.createElement("div");
    cardPriority.classList.add('card_priority');
    let priority = document.createElement("div");
    priority.classList.add('priority');
    priority.classList.add(tasks[index].priority);
    let priorityText = document.createTextNode(tasks[index].priority);
    priority.appendChild(priorityText);
    cardPriority.appendChild(priority);
    return cardPriority;
}

function getCardActions(index, tasks) {
    let cardActions = document.createElement("div");
    cardActions.classList.add('card_actions');
    let editButton = document.createElement("button");
    editButton.onclick = editTask
    editButton.setAttribute("task-id", tasks[index].id);
    editButton.classList.add('button');
    editButton.classList.add('default');
    editButton.classList.add('edit');
    let editButtonText = document.createTextNode('Edit');
    editButton.appendChild(editButtonText);
    let deleteButton = document.createElement("button");
    deleteButton.onclick = removeTask
    deleteButton.setAttribute("task-id", index);
    deleteButton.classList.add('button');
    deleteButton.classList.add('danger');
    let deleteButtonText = document.createTextNode('Delete');
    deleteButton.appendChild(deleteButtonText);
    cardActions.appendChild(editButton);
    cardActions.appendChild(deleteButton);
    return cardActions;
}
function editTask(e) {
    
    console.log(e);
    let taskId = e.target.getAttribute("task-id");
    document.getElementById("task-name").value = tasks[taskId].name;
    document.getElementById("task-description").value = tasks[taskId].description;
    document.getElementById("task-priority").value = tasks[taskId].priority;
    document.getElementById("task-expiration").value = tasks[taskId].expiration;
    document.getElementById("task-id").value = taskId;
    openModal("Edit " + tasks[taskId].name);
}

function removeTask(e) {
    let taskId = e.target.getAttribute("task-id");
    tasks.splice(taskId, 1);
    renderTasks();
  }



function resetData() {
    $("#task-name").val("");
    $("#task-description").val("");
    $("#task-priority").val("");
    $("#task-expiration").val("");
    $("#task-id").val("");
}

$(document).ready(function () {
    console.log('Ready')
    Task = getTasks()
    $(".modal_form").submit(function (event) {
        console.log("Submitting form")
        var formData = {
            name: $("#task-name").val(),
            description: $("#task-description").val(),
            priority: $("#task-priority").val(),
            assignedTo: $("#task-user").val(),
            timestamp: Date.now(),
            dateDue: $("#task-expiration").val()
        };
        console.log(formData)
        var sent = JSON.stringify(formData)
        console.log(sent)
        $.ajax({
            type: "POST",
            url: "task",
            contentType: "application/json",
            data: JSON.stringify(formData),
            dataType: "json",
            encode: true,
            success: window.location.reload(false),
            error: function (e) {
                alert("Error!")
                console.log("ERROR: ", e);
            }
        });
        // Reset FormData after Posting

        resetData();
        event.preventDefault();
    });
})
// $(".modal_Form").submit(function(event) {
//     console.log("Here")
//     event.preventDefault();
//     // event.stopPropagation();        
//     var formData = {
//         name: $("#name").val(),
//         description: $("#task-description").val(),
//         // priority: $("#task-priority").val(),
//         assignedTo: $("#task-user").val(),
//         dateDue: $("#task-expiration").val()
//     }
//     console.log(formData)
//     $.ajax({
//         url: "/createTask",
//         type: "POST",
//         contentType: "application/json",
//         data: JSON.stringify(formData)
//     })
// }
//     )
// })



function openModal(title) {
    let modalTitle = document.getElementById("modal_card_title");
    modalTitle.innerHTML = title;
    let modal = document.getElementById("modal");
    modal.classList.add("show-modal");
}

function closeModal() {
    resetData();
    let element = document.getElementById("modal");
    element.classList.remove("show-modal");
}