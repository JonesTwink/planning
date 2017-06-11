<?php
header('Content-Type: application/json');
require_once '../Database.class.php';
require_once '../Utils.class.php';

$database = new Database();

if (!isset($_POST['subtaskId']) || $_POST['subtaskId'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing subtask ID field.');
}

$currentDate = date("Y-m-d H:i:s");
$response = $database->completeSubtask($_POST['subtaskId'], $currentDate);

if($response->executionResult){
    Utils::sendResponseAndFinish('success', 'Subtask has been completed successfully.');
}
else{
    Utils::sendResponseAndFinish('error', $response->info);
}