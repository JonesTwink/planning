<?php

class Utils{
    public static function sendResponseAndFinish($status, $data){
        echo json_encode(['status' => $status, 'data' => $data], JSON_UNESCAPED_UNICODE, JSON_PRETTY_PRINT);
        exit;
    }
}