$(document).ready(function () {
    $(".modal_form").submit(function (event) {
        var formData = {
            title: $("#task-name").val(),
            //   email: $("#email").val(),
            //   superheroAlias: $("#superheroAlias").val(),
        };
        console.log(title)
        $.ajax({
            type: "POST",
            url: "task",
            contentType: "application/json",
            data: JSON.stringify(formData),
            dataType: "json",
            encode: true,
            success: function (task) {
                $("# ").html("" +
                    "Post Successfully! " +
                    "--->" + JSON.stringify(task) + "");
            },
            error: function (e) {
                alert("Error!")
                console.log("ERROR: ", e);
            }
        });
        // Reset FormData after Posting
        function resetData() {
            $("#task-name").val("");
            $("#task-description").val("");
            $("#task-priority").val("");
            $("#task-expiration").val("");
            $("#task-id").val("new");
        }
        resetData();
        
      

        event.preventDefault();
    });
});

$(document).ready(function () {

    // GET REQUEST
    $("#getResultDiv").click(function (event) {
        event.preventDefault();
        ajaxGet();
    });

    // DO GET
    function ajaxGet() {
        $.ajax({
            type: "GET",
            url: "tasks",
            success: function (result) {
                $('#getResultDiv ul').empty();
                var custList = "";
                $.each(result, function (i, customer) {
                    $('#getResultDiv .list-group').append(customer.firstname + " " + customer.lastname + "")
                });
                console.log("Success: ", result);
            },
            error: function (e) {
                $("#getResultDiv").html("Error");
                console.log("ERROR: ", e);
            }
        });
    }
})


      function openModal(title) {
        let modalTitle = document.getElementById("modal_card_title");
        modalTitle.innerHTML = title;
        let modal = document.getElementById("modal");
        modal.classList.add("show-modal");
      }

      function closeModal(title) {
        clearForm();
        let element = document.getElementById("modal");
        element.classList.remove("show-modal");
      }