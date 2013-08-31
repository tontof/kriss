<?php 
    include 'Session.php'; Session::init();

    if (!Session::isLogged()) {
        header('Location: login.php');
    }
?>
<html>
<head><title>Index</title></head>
<body>
Hello <?php print $_SESSION['username']; ?>, you are logged in.<br>
<a href="logout.php">Logout</a>
</body>
</html>
