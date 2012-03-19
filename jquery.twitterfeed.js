/** TwitterFeed - Get your latest tweets with jQuery
    @requires jQuery 1.5+
    @author Gabriele Romanato
    
    Usage $(element).twitterFeed(options);
    
    Options:
      username: Your Twitter username
      limit: The number of tweets you want to retrieve */


(function($) {


  $.fn.twitterFeed = function(options) {
  
  
    var that = this;
    var settings = {
    
      username: 'gabromanato',
      limit: 5
    
    
    };
    
    options = $.extend(settings, options);
    
    
   var TwitterFeed = new function() {
   
     var url = 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + 
              options.username + '&count=' + options.limit + '&callback=?';
    
    var relativeTime = function(time_value) {
      var values = time_value.split(" ");
      time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
      var parsed_date = Date.parse(time_value);
      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
      var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
      delta = delta + (relative_to.getTimezoneOffset() * 60);

      if (delta < 60) {
    	return 'less than a minute ago';
  	  } else if(delta < 120) {
        return 'about a minute ago';
      } else if(delta < (60*60)) {
        return (parseInt(delta / 60)).toString() + ' minutes ago';
      } else if(delta < (120*60)) {
        return 'about an hour ago';
      } else if(delta < (24*60*60)) {
        return 'about ' + (parseInt(delta / 3600)).toString() + ' hours ago';
      } else if(delta < (48*60*60)) {
        return '1 day ago';
      } else {
        return (parseInt(delta / 86400)).toString() + ' days ago';
      }
    };
    
    var replaceURLs = function(text) {
    
      var replaced = text.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, '<a href="$&">$&</a> ');
      
      return replaced;
    
    
    
    };
    
    this.fetch = function() {
    
    
      $.getJSON(url, function(data) {
      
      
        var html = '<div id="tweets-wrapper">';
        
        $.each(data, function(i, item) {
        
          var tweet = replaceURLs(item.text);
          var time = relativeTime(item.created_at);
          
          html += '<div class="tweet">';
          html += tweet;
          html += '<small>' + time + '</small>';
          html += '</div>';
        
        
        
        });
        
        html += '</div>';
        
        that.html(html);
      
      
      
      });
    
    
    };
        
    
  }();
    
   
              
    return that.each(function() {
    
    
       TwitterFeed.fetch();            
          
    
    
    });
    
  
  
  
  };



})(jQuery);