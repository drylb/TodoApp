// Load existing todos from the database
window.addEventListener("DOMContentLoaded", function() {
  loadTodosFromDatabase();
  console.log('loaded');
});

document.getElementById("todo-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const titleInput = document.getElementById("title-input");
  const startDateInput = document.getElementById("start-date-input");
  const endDateInput = document.getElementById("end-date-input");

  const title = titleInput.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;

  if (title === '' || startDate === '' || endDate === '') {
      alert("Please fill in all fields");
      return;
  }

  var todo = {
      title: title,
      startDate: startDate,
      endDate: endDate,
  };

  saveTodoToDatabase(todo);
  addTodoToList(todo);
  clearFormFields();
});

function loadTodosFromDatabase() {
  // Send a GET request to the PHP script to fetch all todos from the database
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "get_todos.php", true);

  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("Response status: " + xhr.status);
        console.log("Response text: " + xhr.responseText);
          const todos = JSON.parse(xhr.responseText);
          todos.forEach(function(todo) {
              addTodoToList(todo);
          });
      }
  };

  xhr.send();
}

function saveTodoToDatabase(todo) {
  // Send a POST request to the PHP script to save the todo to the database
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "save_todo.php", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(todo));
}


function addTodoToList(todo) {
  const todoList = document.getElementById("todo-list");
  const todoItem = document.createElement("li");
  const currentDate = Date.now();
  const targetDate = new Date(todo.endDate);
  if (currentDate < targetDate) {
    todoItem.id = `todo-item-${todo.id}`
    todoItem.innerHTML = `<span class='title'>${todo.title}</span>
      <span class='start_date'> Start date:${todo.startDate}</span>
      <span class='end_date'> End date: ${todo.endDate} </span>
    `.trim();

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.classList.add('delete_btn')
    deleteButton.addEventListener("click", function() {
        deleteTodoFromDatabase(todo);
        todoItem.remove();
    });
    todoItem.appendChild(deleteButton);
  
    const updateButton = document.createElement("button");
    updateButton.innerText = 'Update';
    updateButton.classList.add('update_btn')
    updateButton.addEventListener('click', function() {
        updateTodoInDatabase(todo);
    });
  
    todoItem.appendChild(updateButton);
    
    todoList.appendChild(todoItem);
  }

}

function deleteTodoFromDatabase(todo) {
  // Send a POST request to the PHP script to delete the todo from the database
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "delete_todo.php", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(todo));
}

function updateTodoInDatabase(todo) {
  let newTitle = prompt("Enter new title:", todo.title);
  if (newTitle.length < 15) {
    newTitle = prompt('Should be 15 symbols');
  }
  if (newTitle === null || newTitle.trim() === "") {
      return;
  }
  
  let newStartDate = prompt("Enter new start date (YYYY-MM-DD):", todo.startDate);
  if (newStartDate === null) {
      return;
  }
  
  let newEndDate = prompt("Enter new end date (YYYY-MM-DD):", todo.endDate);
  if (newEndDate === null) {
      return;
  }

  todo.title = newTitle.trim();
  todo.startDate = newStartDate.trim();
  todo.endDate = newEndDate.trim();

  // Send a POST request to the PHP script to update the todo in the database
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "update_todo.php", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
          // Update the todo in the UI with the new values
          const updatedTodo = JSON.parse(xhr.responseText);
          updateTodoInUI(updatedTodo);
      }
  };
  xhr.send(JSON.stringify(todo));
}

function updateTodoInUI(updatedTodo) {
  const todoItem = document.getElementById("todo-item-" + updatedTodo.id);
  if (todoItem) {
    todoItem.querySelector(".title").textContent = updatedTodo.title;
    todoItem.querySelector(".start_date").textContent = `Start date: ${updatedTodo.startDate}`;
    todoItem.querySelector(".end_date").textContent = `End Date:${updatedTodo.endDate}`;
  }
}


function clearFormFields() {
  document.getElementById("title-input").value = "";
  document.getElementById("start-date-input").value = "";
  document.getElementById("end-date-input").value = "";
}


