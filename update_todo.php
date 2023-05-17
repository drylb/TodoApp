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
$stmt = $conn->prepare("UPDATE todos SET title = ?, start_date = ?, end_date = ? WHERE id = ?");
$stmt->bind_param("sssi", $data->title, $data->startDate, $data->endDate, $data->id);

// Execute the statement and check for errors
if ($stmt->execute() === TRUE) {
    // Fetch the updated todo from the database
    $stmt->close();
    
    $stmt = $conn->prepare("SELECT * FROM todos WHERE id = ?");
    $stmt->bind_param("i", $data->id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $todo = array(
            'id' => $row['id'],
            'title' => $row['title'],
            'startDate' => $row['start_date'],
            'endDate' => $row['end_date']
        );
        echo json_encode($todo);
    } else {
        echo "Error: Todo not found";
    }
} else {
    echo "Error: " . $stmt->error;
}

// Close the statement and the database connection
$stmt->close();
$conn->close();

