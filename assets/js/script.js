var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};



var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};



//changes <li>'s <p> into a <textarea> that we can type on and change its value 
$(".list-group").on("click", "p", function(){
  //get <p>'s vALUE
  var text = $(this)
  .text()
  .trim();

  //creates <textarea>
  var textInput = $("<textarea>")
  .addClass("form-control")
  .val(text);

  //changes <p> into a <textarea>
  $(this).replaceWith(textInput);

  //add focus to the <textarea>
  textInput.trigger("focus")
});

//turns <li> back into its previous state with updated value
$(".list-group").on("blur", "textarea", function() {
  //get the <textarea>'s value
  var text = $(this)
  .val()
  .trim();

  //get parent <ul>'s id attribute
  var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");

  //get task's position in relation to other <li>'s
  var index = $(this)
  .closest(".list-group-item")
  .index();

  tasks[status][index].text = text;
  saveTasks();

  // recreates <p>
  var taskP = $("<p>")
  .addClass("m-1")
  .text(text);

  //replace <textarea> with <p>
  $(this).replaceWith(taskP) 
});

//changes <span> into a <textarea> that we can type on and change its value
$(".list-group").on("click", "span", function() {
  //get current text
  var date = $(this)
  .text()
  .trim();

  //create new <input>
  var dateInput = $("<input>")
  .attr("type", "text")
  .addClass("form-control")
  .val(date);

  //change <span> to <input>
  $(this).replaceWith(dateInput);
  
  //focuses on <input>
  dateInput.trigger("focus")
});

//changes <textarea> back into a <span>
$(".list-group").on("blur", "input[type='text']", function() {
  //get current value
  var date = $(this)
  .val()
  .trim();

  //get parent <ul>'s id attribute
  var status = $(this)
  .closest(".list-group")
  .attr("id")
  .replace("list-", "");
  
  //get task's position in relation to other <li>'s
  var index = $(this)
  .closest(".list-group-item")
  .index();

  //update task in array and re-saves to localStorage
  tasks[status][index].date = date;
  saveTasks();

  //recreate <span> element with bootstrap
  var taskSpan = $("<span>")
  .addClass("badge badge-primary badge-pill")
  .text(date);

  //replace input with span element
  $(this).replaceWith(taskSpan);
});



// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});


// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});


// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});


// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();