<?php
header('Content-Type: application/json');
require_once '../Database.class.php';
require_once '../Utils.class.php';

$database = new Database();

if (!isset($_POST['projectId']) || $_POST['projectId'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing project ID field.');
}

$response = $database->deleteProject($_POST['projectId']);

if($response->executionResult){
    Utils::sendResponseAndFinish('success', 'Project has been deleted successfully.');
}
else{
    Utils::sendResponseAndFinish('error', $response->info);
}