<?php
header('Content-Type: application/json');
require_once '../Database.class.php';
require_once '../Utils.class.php';

$database = new Database();

if (!isset($_POST['subtaskName']) || $_POST['subtaskName'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing subtask name field.');
}

if (!isset($_POST['subtaskDeadline']) || $_POST['subtaskDeadline'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing subtask deadline field.');
}

if (!isset($_POST['parentId']) || $_POST['parentId'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing parent task ID field.');
}

$response = $database->addSubtask($_POST['subtaskName'], $_POST['subtaskDeadline'], $_POST['parentId']);

if($response->executionResult){
    Utils::sendResponseAndFinish('success', 'Subtask has been added successfully.');
}
else{
    Utils::sendResponseAndFinish('error', $response->info);
}