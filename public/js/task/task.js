const $listBody = $("#list-body");
$(function () {
    getTask()
    addTask()
})

function getTask() {
    $.ajax({
        type: 'GET',
        url: 'task/api/tasks',
        success: function (tasks) {
            $listBody.innerHTML = '';
            tasks.forEach(task => {
                let card = getCard(task);
                $listBody.append(card);
            });
        }
    })
}

function addTask() {
    $(".modal_form").off()
    // console.log("Add Task")
    $(".modal_form").on("submit", function (e) {
        e.preventDefault();
        var formData = {
            name: $("#task-name").val(),
            description: $("#task-description").val(),
            priority: $("#task-priority").val(),
            assignedTo: $("#task-user").val(),
            timestamp: Date.now(),
            dateDue: $("#task-expiration").val()
        };
        console.log(formData.dateDue)
        $.ajax({
            type: "POST",
            url: "task",
            data: formData,
            // success: () =>{window.location.reload(false)}
            success: function (task) {
                console.log(task)
                let card = getCard(task);
                $listBody.append(card);
                resetData();
                closeModal();
            }
        })
    })
}

function getCard(task) {
    let card = document.createElement("div");
    card.classList.add('card');

    card.appendChild(getCardText(task));
    card.appendChild(getCardPriority(task));
    card.appendChild(getCardAction(task));
    return card;
}

function getCardText(task) {
    let cardText = document.createElement("div");
    cardText.classList.add("card_text");
    let textnode = document.createTextNode(task.name);
    cardText.appendChild(textnode);
    return cardText;
}

function getCardPriority(task) {
    let cardPriority = document.createElement("div");
    cardPriority.classList.add('card_priority');
    let priority = document.createElement("div");
    priority.classList.add("priority");
    priority.classList.add(task.priority);
    let priorityText = document.createTextNode(task.priority);
    priority.appendChild(priorityText);
    cardPriority.appendChild(priority);
    return cardPriority;
}

function getCardAction(task) {
    let cardActions = document.createElement("div");
    cardActions.classList.add('card_actions');
    let editButton = document.createElement("button");
    editButton.onclick = editTask
    editButton.setAttribute("task-id", task.id);
    editButton.classList.add('button');
    editButton.classList.add('default');
    editButton.classList.add('edit');
    let editButtonText = document.createTextNode('Edit');
    editButton.appendChild(editButtonText);
    let deleteButton = document.createElement("button");
    deleteButton.onclick = confirmRemove
    deleteButton.setAttribute("task-id", task.id);
    deleteButton.classList.add('button');
    deleteButton.classList.add('danger');
    let deleteButtonText = document.createTextNode('Delete');
    deleteButton.appendChild(deleteButtonText);
    cardActions.appendChild(editButton);
    cardActions.appendChild(deleteButton);
    return cardActions;
}

function editTask(e) {
    const taskId = e.target.getAttribute("task-id");
    const $div = $(e.target).closest(".card")
    $.ajax({
        type: 'GET',
        url: `task/api/tasks/${taskId}`,
        success: function (task) {
            console.log(task)
            document.getElementById("task-name").value = task.name;
            document.getElementById("task-description").value = task.description;
            $("#task-expiration").val(task.dateDue.substr(0, 10))
            document.getElementById("task-priority").value = task.priority;
            document.getElementById("task-id").value = task.id;
            openModal("Edit " + task.name);
        }
    })
    $(".modal_form").off();
    $(".modal_form").on("submit", function (event) {
        event.preventDefault()
        var formData = {
            taskId: $("#task-id").val(),
            name: $("#task-name").val(),
            description: $("#task-description").val(),
            priority: $("#task-priority").val(),
            assignedTo: $("#task-user").val(),
            timeEdited: Date.now(),
            dateDue: $("#task-expiration").val()
        };
        $.ajax({
            type: "PUT",
            url: "task",
            data: formData,
            success: function (task) {
                console.log(task)

                let card = getCard(task);
                $listBody.append(card);
                resetData();
                closeModal();
            }
        })
    })
}
const $confirmModal = $("#confirm");

function confirmRemove() {
    $confirmModal.addClass("show-modal")
    var $selectedTask = $(this).closest(".card", "div");
    var $taskID = $(this).attr("task-id");
    console.log($selectedTask);
    $("#confirmDel").on("click", () => {
        $.ajax({
            type: 'DELETE',
            data: {
                id: $taskID
            },
            url: 'task',
            success: function (data) {
                console.log(data)
                confirmRemove();
                $selectedTask.remove();
            }
        })
    })
}

function closeConfirm() {
    $confirmModal.removeClass("show-modal")
}



function resetData() {
    $("#task-name").val("");
    $("#task-description").val("");
    $("#task-priority").val("");
    $("#task-expiration").val("");
    $("#task-id").val("");
}


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