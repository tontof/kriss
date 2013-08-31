<?php 
    include 'Session.php'; Session::init();

    Session::logout();
    header('Location: login.php');
?>
