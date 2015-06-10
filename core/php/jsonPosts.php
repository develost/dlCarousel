<?php
    //$_GET['t'];
    header('Content-Type: application/json');
    $posts = file_get_contents('./sample.json', true);
    echo $posts;
?>