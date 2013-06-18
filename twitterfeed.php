<?php
require_once('twitterfeed/TwitterFeed.php'); 
header('Content-Type: application/json');
$twitterFeed = new TwitterFeed('gabromanato', 1);
$twitterFeed->getTweets();
?>