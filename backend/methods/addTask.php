<?php
header('Content-Type: application/json');
require_once '../Database.class.php';
require_once '../Utils.class.php';

$database = new Database();

if (!isset($_POST['taskName']) || $_POST['taskName'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing task name field.');
}

if (!isset($_POST['taskDeadline']) || $_POST['taskDeadline'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing task deadline field.');
}

if (!isset($_POST['parentId']) || $_POST['parentId'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing parent project ID field.');
}

$response = $database->addTask($_POST['taskName'], $_POST['taskDeadline'], $_POST['parentId']);

if($response->executionResult){
    Utils::sendResponseAndFinish('success', 'Task has been added successfully.');
}
else{
    Utils::sendResponseAndFinish('error', $response->info);
}