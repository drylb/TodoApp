<?php
// Retrieve the JSON data
$data = json_decode(file_get_contents("php://input"));

// Connect to the database
include 'db_connect.php';

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Prepare and bind the SQL statement
$stmt = $conn->prepare("DELETE FROM todos WHERE id = ?");
$stmt->bind_param("i", $data->id);

// Execute the statement and check for errors
if ($stmt->execute() === TRUE) {
    echo "Todo deleted successfully";
} else {
    echo "Error: " . $stmt->error;
}

// Close the statement and the database connection
$stmt->close();
$conn->close();
?>
