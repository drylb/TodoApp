<!DOCTYPE html>
<html>
<head>
  <title>Todo App</title>
  <link rel='stylesheet' href='index.css'>
</head>
<body>
  <h1>Todo App</h1>
  <form id="todo-form" action="add_todo.php" method="POST">
    <label for="title">Title:</label>
    <input type="text" id="title-input" placeholder="Todo title min 15 symbols" name="title" required minlength="15">
    <br>
    <label for="start-date">Start Date:</label>
    <input type="date" id="start-date-input" name="start-date" required>
    <br>
    <label for="end-date">End Date:</label>
    <input type="date" id="end-date-input" name="end-date" required>
    <br>
    <button type="submit">Add</button>
  </form>
  <ul id="todo-list">
  </ul>

  <script src="script.js"></script>
</body>
</html>
