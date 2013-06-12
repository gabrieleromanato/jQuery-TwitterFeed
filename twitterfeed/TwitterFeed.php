<?php
require_once('twitteroauth.php');

class TwitterFeed {
	public $user;
	public $tweetsNumber;
	private $consumerKey = '';
	private $consumerSecret = '';
	private $accessToken = '';
	private $accessTokenSecret = '';
	private $connection;
	
	public function __construct($username, $tweets) {
		$this->user = $username;
		$this->tweetsNumber = $tweets;
		$this->connection = new TwitterOAuth($this->consumerKey, $this->consumerSecret, $this->accessToken, $this->accessTokenSecret);
	}
	
	public function getTweets() {
		$tweets = $this->connection->get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' . $this->user . '&count=' . $this->tweetsNumber);
		echo json_encode($tweets);
	}
	
}