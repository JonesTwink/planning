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
}