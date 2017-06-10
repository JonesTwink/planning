<?php
class Database
{
    private $connection;

    function __construct()
    {
        $this->connection = $this->establishConnection();
    }

    private function establishConnection(){
        $secret = require_once 'secret.php';
        $connection = new PDO("mysql:dbname=$secret->name;host=127.0.0.1;charset=UTF8", $secret->username, $secret->pass);
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $connection->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

        return $connection;
    }

    function getProjects(){
        $statement = $this->connection->prepare("SELECT * FROM  `project`");
        if ($statement->execute())
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        else
            return false;
    }

    function getTasksByProject($projectId){
        $statement = $this->connection->prepare("SELECT * FROM  `task` WHERE `parentId`=:parentId");
        $statement->bindParam(':parentId', $projectId);
        if ($statement->execute())
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        else
            return false;
    }

    function getSubtasksByTask($taskId){
        $statement = $this->connection->prepare("SELECT * FROM  `subtask` WHERE `parentId`=:parentId");
        $statement->bindParam(':parentId', $taskId);
        if ($statement->execute())
            return $statement->fetchAll(PDO::FETCH_ASSOC);
        else
            return false;
    }

    function addProject($projectName, $projectDeadline){
        try{
            $statement = $this->connection->prepare("INSERT INTO `project` (`title`, `deadline`) VALUES (:projectName, :projectDeadline)");

            $statement->bindParam(':projectName', $projectName);
            $statement->bindParam(':projectDeadline', $projectDeadline);

            return $this->formatStatementExecutionResult($statement->execute(), $this->connection->errorInfo()[2]);
        }
        catch(Exception $e){
            return $this->formatStatementExecutionResult(false, $e->getMessage());
        }
    }
    function deleteProject($projectId){
        try{
            $statement = $this->connection->prepare("DELETE FROM `project` WHERE `id` = :projectId");

            $statement->bindParam(':projectId', $projectId);

            return $this->formatStatementExecutionResult($statement->execute(), $this->connection->errorInfo()[2]);
        }
        catch(Exception $e){
            return $this->formatStatementExecutionResult(false, $e->getMessage());
        }
    }

    function formatStatementExecutionResult($result, $error = 'No error message provided.'){
        if ($result)
            return (object)['executionResult'=> true];
        else
            return (object)['executionResult'=> false, 'info' => $error];
    }
}