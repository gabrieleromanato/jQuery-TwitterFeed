/** TwitterFeed - Get your latest tweets with jQuery
    @requires jQuery 1.5+
    @author Gabriele Romanato

    Usage $(element).twitterFeed(options);

    Options:
      url: Path to the main twitterfeed.php file
      cache: true|false If true, your tweets will be cached for 1 hour
*/


 (function(factory) {
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], factory);
		
	} else {
		factory(jQuery);
		
	}
	
} (function($) {
	var pluses = /\+/g;

	function raw(s) {
		return s;
		
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
		
	}

	function converted(s) {
		if (s.indexOf('"') === 0) {
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
			
		}
		try {
			return config.json ? JSON.parse(s) : s;
			
		} catch(er) {}
		
	}
	var config = $.cookie = function(key, value, options) {
		if (value !== undefined) {
			options = $.extend({},
			config.defaults, options);
			if (typeof options.expires === 'number') {
				var days = options.expires,
				t = options.expires = new Date();
				t.setHours(t.getHours() + days);
				
			}
			value = config.json ? JSON.stringify(value) : String(value);
			return (document.cookie = [encodeURIComponent(key), '=', config.raw ? value: encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path: '', options.domain ? '; domain=' + options.domain: '', options.secure ? '; secure': ''].join(''));
			
		}
		var decode = config.raw ? raw: decoded;
		var cookies = document.cookie.split('; ');
		var result = key ? undefined: {};
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = decode(parts.join('='));
			if (key && key === name) {
				result = converted(cookie);
				break;
				
			}
			if (!key) {
				result[name] = converted(cookie);
				
			}
			
		}
		return result;
		
	};
	config.defaults = {};
	$.removeCookie = function(key, options) {
		if ($.cookie(key) !== undefined) {
			$.cookie(key, '', $.extend(options, {
				expires: -1
				
			}));
			return true;
			
		}
		return false;
		
	};
	
}));
 (function($) {
	$.fn.twitterFeed = function(options) {
		var that = this;
		var settings = {
			url: 'twitterfeed.php',
			cache: false
			
		};
		options = $.extend(settings, options);
		var TwitterFeed = new
		function() {
			var url = options.url;
			var relativeTime = function(time_value) {
				var values = time_value.split(" ");
				time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
				var parsed_date = Date.parse(time_value);
				var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
				var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
				delta = delta + (relative_to.getTimezoneOffset() * 60);
				if (delta < 60) {
					return 'less than a minute ago';
					
				} else if (delta < 120) {
					return 'about a minute ago';
					
				} else if (delta < (60 * 60)) {
					return (parseInt(delta / 60)).toString() + ' minutes ago';
					
				} else if (delta < (120 * 60)) {
					return 'about an hour ago';
					
				} else if (delta < (24 * 60 * 60)) {
					return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
					
				} else if (delta < (48 * 60 * 60)) {
					return '1 day ago';
					
				} else {
					return (parseInt(delta / 86400)).toString() + ' days ago';
					
				}
				
			};
			var createCookie = function(value) {
				$.cookie('tweet', value, {
					expires: 1
					
				});
				
			};
			var getCookie = function() {
				var cookie = $.cookie('tweet');
				return cookie;
				
			};
			var replaceURLs = function(text) {
				var replaced = text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi, '<a href="$1">$1</a>').
				replace(/(^|\s)#(\w+)/g, '$1<a href="https://twitter.com/search?q=%23$2&src=hash">#$2</a>').
				replace(/(^|\s)@(\w+)/g, '$1<a href="https://twitter.com/$2">@$2</a>');
				return replaced;
				
			};
			this.fetch = function() {
				if (!options.cache) {
					$.getJSON(url, 
					function(data) {
						var html = '<div id="tweets-wrapper">';
						$.each(data, 
						function(i, item) {
							var tweet = replaceURLs(item.text);
							var time = relativeTime(item.created_at);
							var id = item.id_str;
							html += '<div class="tweet">';
							html += tweet;
							html += '<small>' + time + '</small>';
							html += '<div class="tweet-actions">';
							html += '<a class="tweet-reply" href="https://twitter.com/intent/tweet?in_reply_to=' + id + '" target="_blank">Reply</a>';
							html += '<a class="tweet-retweet" href="https://twitter.com/intent/retweet?tweet_id=' + id + '" target="_blank">Retweet</a>';
							html += '<a class="tweet-favorite" href="https://twitter.com/intent/favorite?tweet_id=' + id + '" target="_blank">Favorite</a>';
							html += '</div>';
							html += '</div>';
							
							
						});
						html += '</div>';
						that.html(html);
						
					});
					
				} else {
					var tweet = getCookie();
					if (tweet !== undefined) {
						that.html(tweet);
						
					} else {
						$.getJSON(url, 
						function(data) {
							var html = '<div id="tweets-wrapper">';
							$.each(data, 
							function(i, item) {
								var tweet = replaceURLs(item.text);
								var time = relativeTime(item.created_at);
								var id = item.id_str;
								html += '<div class="tweet">';
								html += tweet;
								html += '<small>' + time + '</small>';
								html += '<div class="tweet-actions">';
								html += '<a class="tweet-reply" href="https://twitter.com/intent/tweet?in_reply_to=' + id + '" target="_blank">Reply</a>';
								html += '<a class="tweet-retweet" href="https://twitter.com/intent/retweet?tweet_id=' + id + '" target="_blank">Retweet</a>';
								html += '<a class="tweet-favorite" href="https://twitter.com/intent/favorite?tweet_id=' + id + '" target="_blank">Favorite</a>';
								html += '</div>';
								html += '</div>';
								
								
							});
							html += '</div>';
							createCookie(html);
							that.html(getCookie());
							
						});
						
					}
					
				}
				
			};
			
		} ();
		return that.each(function() {
			TwitterFeed.fetch();
			
		});
		
	};
	
})(jQuery);