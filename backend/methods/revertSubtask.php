<?php
header('Content-Type: application/json');
require_once '../Database.class.php';
require_once '../Utils.class.php';

$database = new Database();

if (!isset($_POST['subtaskId']) || $_POST['subtaskId'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing subtask ID field.');
}

$response = $database->revertSubtask($_POST['subtaskId']);

if($response->executionResult){
    Utils::sendResponseAndFinish('success', 'Subtask status has been reset successfully.');
}
else{
    Utils::sendResponseAndFinish('error', $response->info);
}