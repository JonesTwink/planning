<?php
header('Content-Type: application/json');
require_once '../Database.class.php';
require_once '../Utils.class.php';

$database = new Database();

if (!isset($_POST['projectName']) || $_POST['projectName'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing project name field.');
}

if (!isset($_POST['projectDeadline']) || $_POST['projectDeadline'] === ''){
    Utils::sendResponseAndFinish('error', 'Missing project deadline field.');
}

$response = $database->addProject($_POST['projectName'], $_POST['projectDeadline']);

if($response->executionResult){
    Utils::sendResponseAndFinish('success', 'Project has been added successfully.');
}
else{
    Utils::sendResponseAndFinish('error', $response->info);
}