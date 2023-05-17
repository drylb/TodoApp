<?php
// Connect to the database
include 'db_connect.php';

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch all todos from the database
$sql = "SELECT * FROM todos";
$result = $conn->query($sql);

$todos = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $todo = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'startDate' => $row['start_date'],
            'endDate' => $row['end_date'],
        );
        array_push($todos, $todo);
    }
}

// Return the todos as JSON response
header('Content-Type: application/json');
echo json_encode($todos);

// Close the database connection
$conn->close();

