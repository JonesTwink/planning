<?php
header('Content-Type: application/json');
require_once '../Database.class.php';
require_once '../Utils.class.php';

$database = new Database();

$projects = $database->getProjects();

if ($projects){
    $structuredProjectsData = fillProjectsWithData($projects, $database);
    Utils::sendResponseAndFinish('success', $structuredProjectsData);
}
else{
    Utils::sendResponseAndFinish('error', 'Received exception from the database.');
}



function fillProjectsWithData($projects, $database){
    $data = array();
    foreach ($projects as $project){
        $projectTasks = $database->getTasksByProject($project['id']);
        $project['tasks'] = fillTasksWithSubtasks($projectTasks, $database);
        $data[] = $project;
    }

    return $data;
}

function fillTasksWithSubtasks($tasks, $database){
    $filledTasks = array();
    foreach ($tasks as $task){
        $taskSubtasks = $database->getSubtasksByTask($task['id']);
        $subtasksWithStatusInfo = setStatusOfSubtasksAnDefineTaskStatus($taskSubtasks);
        $task['subtasks'] = $subtasksWithStatusInfo['subtasks'];
        $task['status'] = $subtasksWithStatusInfo['overallStatus'];
        $filledTasks[] = $task;
    }
    return $filledTasks;
}

function setStatusOfSubtasksAnDefineTaskStatus($subtasks){
    $subtasksWithDefinedStatus = array();
    $statusInfo = ['complete' => 0, 'pending'=> 0, 'overdue' => 0, 'complete(overdue)' => 0];
    foreach ($subtasks as $subtask){
        $subtask = defineSubtaskStatus($subtask);
        $subtasksWithDefinedStatus[] = $subtask;
        $statusInfo[$subtask['status']]++;
    }

    $overallStatus = calculateOverallStatus($statusInfo);
    return [ 'subtasks' => $subtasksWithDefinedStatus, 'overallStatus' => $overallStatus];
}

function defineSubtaskStatus($subtask){
    $deadlineDate = (new DateTime($subtask['deadline']))->setTime(0, 0);

    if($subtask['completeAt'] == null){
        $currentDate = (new DateTime())->setTime(0, 0);
        if ($deadlineDate >= $currentDate){
            $status = 'pending';
        }
        else{
            $status = 'overdue';
        }

    } else{
        $completionDate = (new DateTime($subtask['completeAt']))->setTime(0, 0);
        if ($deadlineDate >= $completionDate){
            $status = 'complete';
        }
        else{
            $status = 'complete(overdue)';
        }
    }
    $subtask['status'] = $status;
    return $subtask;
}

function calculateOverallStatus($statusInfo){
    if ($statusInfo['pending'] > 0){
        return 'pending';
    }
    else{
        if ($statusInfo['overdue'] > 0){
            return 'overdue';
        }
        else{
            return 'complete';
        }
    }
}