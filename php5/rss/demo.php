<?php 
    include 'Rss.php';
    if (isset($_POST['url'])) {
        $data = file_get_contents(
            filter_var($_POST['url'], FILTER_VALIDATE_URL)
        );
        $rss = Rss::loadDom($data);
        if (empty($rss['error'])) {
            $dom = $rss['dom'];
            $max = -1;
            if (!empty($_POST['max'])) {
                $max = (int) $_POST['max'];
            }
        } else {
            $error = $rss['error'];
        }
    }
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Rss</title>
    <meta charset="utf-8">
  </head>
  <body>
    <form method="post" action="">
      Url : <input type="text" name="url"><br>
      Max items : <input type="text" name="max"><br>
      <input type="submit" value="Submit">
    </form>
    <?php
        if (!empty($error)) {
            echo $error;
        }
        if (isset($dom)) {
            $feed = Rss::getFeed($dom);
            $items = Rss::getItems($dom, $max);
    ?>
<a
  href="<?php echo htmlspecialchars($feed['htmlUrl']); ?>"
  title="<?php echo htmlspecialchars($feed['description']); ?>"
>
<?php echo htmlspecialchars($feed['title']); ?>
</a> :
<ol>
<?php
  foreach($items as $item) {
?>
    <li>
      <a href="<?php echo htmlspecialchars($item['link']); ?>"><?php echo htmlspecialchars($item['title']); ?></a><br>
      <em><?php echo utf8_encode(strftime('%A %d %B %Y - %H:%M', strtotime($item['time']))); ?></em>
      by <strong><?php echo htmlspecialchars($item['author']); ?></strong><br>
      <?php echo substr(htmlspecialchars(strip_tags($item['content'])), 0, 100).'...'; ?>
    </li>
<?php
  }
?>
</ol>
    <?php
        }
    ?>
  </body>
</html>
