<?php
header('Content-Type: application/json');
require_once '../Database.class.php';
require_once '../Utils.class.php';

$database = new Database();

if (!isset($_POST['taskId']) || $_POST['taskId'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing task ID field.');
}

$response = $database->deleteTask($_POST['taskId']);

if($response->executionResult){
    Utils::sendResponseAndFinish('success', 'Task has been deleted successfully.');
}
else{
    Utils::sendResponseAndFinish('error', $response->info);
}