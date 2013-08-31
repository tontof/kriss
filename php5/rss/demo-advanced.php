<?php 
    include 'Rss.php';

    Rss::$itemFormat['author'][] = 'channel>itunes:author';
    Rss::$itemFormat['enclosure'] = array('>enclosure*[url]');

    $data = file_get_contents(
        'http://www.rssboard.org/files/example-multiple-enclosures.xml'
    );
    $rss = Rss::loadDom($data);
    if (empty($rss['error'])) {
        $dom = $rss['dom'];
    } else {
        $error = $rss['error'];
    }

?>
<!DOCTYPE html>
<html>
  <head>
    <title>Rss</title>
    <meta charset="utf-8">
  </head>
  <body>
<?php
if (!empty($error)) {
    die($error);
}
if (isset($dom)) {
    $feed = Rss::getFeed($dom);
    $items = Rss::getItems($dom);
?>
<a
  href="<?php echo htmlspecialchars($feed['htmlUrl']); ?>"
  title="<?php echo htmlspecialchars($feed['description']); ?>"
>
<?php echo htmlspecialchars($feed['title']); ?>
</a> :
<ol>
<?php foreach($items as $item) { ?>
    <li>
      <a href="<?php echo htmlspecialchars($item['link']); ?>"><?php echo htmlspecialchars($item['title']); ?></a><br>
      <em><?php echo utf8_encode(strftime('%A %d %B %Y - %H:%M', strtotime($item['time']))); ?></em>
      by <strong><?php echo htmlspecialchars($item['author']); ?></strong><br>
      <?php echo substr(htmlspecialchars(strip_tags($item['content'])), 0, 100).'...'; ?><br>
      enclosures:<br>
      <?php foreach($item['enclosure'] as $enclosure) { ?>
      <a href="<?php echo htmlspecialchars($enclosure); ?>">
        <?php echo htmlspecialchars($enclosure); ?>
      </a><br>
      <?php } ?>
    </li>
<?php } ?>
</ol>
<?php
}
?>
  </body>
</html>
